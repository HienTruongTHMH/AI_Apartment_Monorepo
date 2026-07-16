import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, PaymentType, ContractStatus } from '@prisma/client';

@Injectable()
export class BillingCronService {
  private readonly logger = new Logger(BillingCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Bắt đầu chạy Cron Job sinh hóa đơn hàng tháng...');
    await this.generateInvoices();
    this.logger.log('Hoàn thành Cron Job sinh hóa đơn hàng tháng.');
  }

  async generateInvoices(today: Date = new Date()) {
    // 1. Query all Active contracts
    const activeContracts = await this.prisma.contract.findMany({
      where: {
        contractStatus: ContractStatus.Active,
      },
    });

    this.logger.log(`Tìm thấy ${activeContracts.length} hợp đồng đang có hiệu lực (Active).`);

    for (const contract of activeContracts) {
      try {
        const checkResult = this.checkShouldGenerateInvoice(contract.startDate, today);
        if (!checkResult.shouldGenerate || !checkResult.dueDate) {
          continue;
        }

        const { dueDate } = checkResult;
        const targetYear = dueDate.getFullYear();
        const targetMonth = dueDate.getMonth(); // 0-11
        const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();

        const startOfMonth = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(targetYear, targetMonth, maxDay, 23, 59, 59, 999);

        // Guard: Check if payment already exists for this contract, type=Rent in the target month
        const existingPayment = await this.prisma.payment.findFirst({
          where: {
            contractId: contract.id,
            type: PaymentType.Rent,
            dueDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        if (existingPayment) {
          this.logger.log(
            `Hợp đồng ID: ${contract.id} đã có hóa đơn thuê cho tháng ${targetMonth + 1}/${targetYear}. Bỏ qua.`,
          );
          continue;
        }

        // Insert new rent payment
        await this.prisma.payment.create({
          data: {
            contractId: contract.id,
            amount: contract.rentPrice,
            status: PaymentStatus.Pending,
            type: PaymentType.Rent,
            dueDate: dueDate,
          },
        });

        this.logger.log(
          `Đã tạo hóa đơn tiền thuê cho hợp đồng ID: ${contract.id}, số tiền: ${contract.rentPrice}, hạn thanh toán: ${dueDate.toISOString().slice(0, 10)}`,
        );
      } catch (error) {
        this.logger.error(`Lỗi khi xử lý hóa đơn cho hợp đồng ID: ${contract.id}`, error.stack);
      }
    }
  }

  checkShouldGenerateInvoice(startDate: Date, today: Date): { shouldGenerate: boolean; dueDate?: Date } {
    const startDay = startDate.getDate();

    // target date check is 4 days in the future from today
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 4);

    const futureYear = futureDate.getFullYear();
    const futureMonth = futureDate.getMonth();
    const futureDay = futureDate.getDate();

    // Check last day of the future month
    const maxDay = new Date(futureYear, futureMonth + 1, 0).getDate();
    const targetDay = Math.min(startDay, maxDay);

    if (futureDay === targetDay) {
      const dueDate = new Date(futureYear, futureMonth, targetDay, 0, 0, 0, 0);
      return { shouldGenerate: true, dueDate };
    }

    return { shouldGenerate: false };
  }
}
