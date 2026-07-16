import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, PaymentType, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: any, contractId?: string) {
    const whereClause: any = {};

    if (contractId) {
      const contract = await this.prisma.contract.findUnique({
        where: { id: contractId },
      });

      if (!contract) {
        throw new NotFoundException('Hợp đồng không tồn tại');
      }

      if (contract.ownerId !== user.ownerProfileId && contract.tenantId !== user.tenantProfileId) {
        throw new ForbiddenException('Bạn không có quyền truy cập thanh toán của hợp đồng này');
      }

      whereClause.contractId = contractId;
    } else {
      if (user.hasOwnerProfile && user.ownerProfileId) {
        whereClause.contract = { ownerId: user.ownerProfileId };
      } else if (user.hasTenantProfile && user.tenantProfileId) {
        whereClause.contract = { tenantId: user.tenantProfileId };
      } else {
        throw new ForbiddenException('Tài khoản của bạn chưa kích hoạt vai trò chủ nhà hoặc khách thuê');
      }
    }

    return this.prisma.payment.findMany({
      where: whereClause,
      include: {
        contract: {
          include: {
            apartment: true,
            owner: {
              select: {
                fullName: true,
                bankAccount: true,
              },
            },
            tenant: {
              select: {
                fullName: true,
                account: {
                  select: {
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingPayments(ownerProfileId: string) {
    if (!ownerProfileId) {
      throw new ForbiddenException('Tài khoản của bạn chưa kích hoạt vai trò chủ nhà');
    }

    return this.prisma.payment.findMany({
      where: {
        status: { in: [PaymentStatus.Pending, PaymentStatus.Overdue] },
        contract: { ownerId: ownerProfileId },
      },
      include: {
        contract: {
          include: {
            apartment: true,
            tenant: {
              select: {
                fullName: true,
                account: {
                  select: {
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async confirmPayment(paymentId: string, ownerProfileId: string) {
    if (!ownerProfileId) {
      throw new ForbiddenException('Tài khoản của bạn chưa kích hoạt vai trò chủ nhà');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { contract: true },
    });

    if (!payment) {
      throw new NotFoundException('Hóa đơn không tồn tại');
    }

    if (payment.contract.ownerId !== ownerProfileId) {
      throw new ForbiddenException('Bạn không có quyền xác nhận hóa đơn này');
    }

    if (payment.status === PaymentStatus.Paid) {
      throw new BadRequestException('Hóa đơn này đã được thanh toán');
    }

    if (payment.status !== PaymentStatus.Pending && payment.status !== PaymentStatus.Overdue) {
      throw new BadRequestException('Trạng thái hóa đơn không hợp lệ để xác nhận');
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.Paid,
        method: PaymentMethod.BankTransfer,
        paymentDate: new Date(),
      },
    });
  }
}
