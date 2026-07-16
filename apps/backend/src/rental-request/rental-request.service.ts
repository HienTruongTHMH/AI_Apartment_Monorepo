import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class RentalRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(accountId: string, apartmentId: string, message?: string) {
    // Check if already requested and pending
    const existing = await this.prisma.rentalRequest.findFirst({
      where: {
        accountId,
        apartmentId,
        status: 'Pending'
      }
    });

    if (existing) {
      throw new BadRequestException('Bạn đã gửi yêu cầu thuê cho căn hộ này rồi');
    }

    // Get apartment to find owner
    const apartment = await this.prisma.apartment.findUnique({
      where: { id: apartmentId },
      include: {
        owner: {
          include: {
            account: true
          }
        }
      }
    });

    if (!apartment) throw new NotFoundException('Căn hộ không tồn tại');
    if (apartment.apartmentStatus !== 'Available') throw new BadRequestException('Căn hộ hiện không trống');

    const request = await this.prisma.rentalRequest.create({
      data: {
        accountId,
        apartmentId,
        message
      }
    });

    const tenantAccount = await this.prisma.account.findUnique({
      where: { id: accountId }
    });

    // Gửi email thông báo cho owner ở chế độ chạy nền (fire and forget)
    if (apartment.owner.account.email) {
      this.mailService.sendRentalRequestNotification(
        apartment.owner.account.email,
        tenantAccount?.fullName || 'Khách',
        apartment.fullAddress,
        message
      ).catch(e => console.error('Failed to send email:', e));
    }

    return {
      message: 'Gửi yêu cầu thành công',
      ownerContact: {
        email: apartment.owner.account.email,
        phoneNumber: apartment.owner.account.phone,
        name: apartment.owner.account.fullName
      },
      request
    };
  }

  async findMyRequests(accountId: string) {
    return this.prisma.rentalRequest.findMany({
      where: { accountId },
      include: {
        apartment: {
          include: {
            apartmentListing: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            },
            owner: {
              include: { account: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOwnerRequests(ownerAccountId: string) {
    // Get all apartments of this owner
    const ownerProfile = await this.prisma.ownerProfile.findUnique({
      where: { accountId: ownerAccountId },
    });

    if (!ownerProfile) throw new ForbiddenException('Chưa đăng ký chủ nhà');

    return this.prisma.rentalRequest.findMany({
      where: {
        apartment: {
          ownerId: ownerProfile.id
        }
      },
      include: {
        apartment: true,
        account: true // the tenant who requested
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async accept(id: string, ownerAccountId: string) {
    const request = await this.prisma.rentalRequest.findUnique({
      where: { id },
      include: { apartment: true }
    });

    if (!request) throw new NotFoundException('Yêu cầu không tồn tại');
    if (request.status !== 'Pending') throw new BadRequestException('Yêu cầu không ở trạng thái chờ');

    const ownerProfile = await this.prisma.ownerProfile.findUnique({
      where: { accountId: ownerAccountId }
    });

    if (request.apartment.ownerId !== ownerProfile?.id) {
      throw new ForbiddenException('Bạn không có quyền duyệt yêu cầu này');
    }

    return this.prisma.rentalRequest.update({
      where: { id },
      data: { status: 'Accepted' }
    });
  }

  async reject(id: string, ownerAccountId: string) {
    const request = await this.prisma.rentalRequest.findUnique({
      where: { id },
      include: { apartment: true }
    });

    if (!request) throw new NotFoundException('Yêu cầu không tồn tại');
    if (request.status !== 'Pending') throw new BadRequestException('Yêu cầu không ở trạng thái chờ');

    const ownerProfile = await this.prisma.ownerProfile.findUnique({
      where: { accountId: ownerAccountId }
    });

    if (request.apartment.ownerId !== ownerProfile?.id) {
      throw new ForbiddenException('Bạn không có quyền từ chối yêu cầu này');
    }

    return this.prisma.rentalRequest.update({
      where: { id },
      data: { status: 'Rejected' }
    });
  }
}
