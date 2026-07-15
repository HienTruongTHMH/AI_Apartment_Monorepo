import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Req() req) {
    const accountId = req.user.accountId;

    // Check if owner
    const ownerProfile = await this.prisma.ownerProfile.findUnique({
      where: { accountId }
    });

    if (ownerProfile) {
      return this.prisma.payment.findMany({
        where: {
          contract: {
            ownerId: ownerProfile.id
          }
        },
        include: {
          contract: {
            include: {
              apartment: true
            }
          }
        }
      });
    }

    // Check if tenant
    const tenantProfile = await this.prisma.tenantProfile.findUnique({
      where: { accountId }
    });

    if (tenantProfile) {
      return this.prisma.payment.findMany({
        where: {
          contract: {
            tenantId: tenantProfile.id
          }
        },
        include: {
          contract: {
            include: {
              apartment: true
            }
          }
        }
      });
    }

    return [];
  }
}
