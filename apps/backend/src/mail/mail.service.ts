import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendRentalRequestNotification(to: string, tenantName: string, apartmentAddress: string, message?: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `[Yêu cầu thuê mới] Căn hộ: ${apartmentAddress}`,
        text: `Chào bạn,\n\nKhách thuê ${tenantName} vừa gửi yêu cầu thuê cho căn hộ "${apartmentAddress}".\n\nLời nhắn từ khách thuê:\n"${message || 'Không có'}"\n\nVui lòng đăng nhập vào hệ thống quản lý để xem và duyệt yêu cầu này.\n\nTrân trọng,\nApartment Network Team`,
      });
      this.logger.log(`Đã gửi email thông báo thành công tới ${to}`);
    } catch (error: any) {
      this.logger.error(`Lỗi khi gửi email tới ${to}: ${error.message}`);
    }
  }
}
