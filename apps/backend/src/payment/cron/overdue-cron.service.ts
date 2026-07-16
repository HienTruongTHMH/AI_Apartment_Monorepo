import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class OverdueCronService {
  private readonly logger = new Logger(OverdueCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Bắt đầu chạy Cron Job đánh dấu hóa đơn quá hạn...');
    await this.markOverdue();
    this.logger.log('Hoàn thành Cron Job đánh dấu hóa đơn quá hạn.');
  }

  async markOverdue(today: Date = new Date()) {
    try {
      const result = await this.prisma.payment.updateMany({
        where: {
          status: PaymentStatus.Pending,
          dueDate: {
            lt: today,
          },
        },
        data: {
          status: PaymentStatus.Overdue,
        },
      });

      if (result.count > 0) {
        this.logger.log(`Đã cập nhật ${result.count} hóa đơn thành Overdue (quá hạn).`);
      }
    } catch (error) {
      this.logger.error('Lỗi khi cập nhật trạng thái quá hạn cho các hóa đơn:', error.stack);
    }
  }
}
