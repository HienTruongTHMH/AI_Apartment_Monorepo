import { Prisma } from '@prisma/client';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApartmentStatus } from '@prisma/client';
import { CreateDraftDto } from './dto/create-draft.dto';



@Injectable()
export class ContractService {

  constructor(private readonly prismaService: PrismaService) { }

  create(createContractDto: CreateContractDto) {
    return 'This action adds a new contract';
  }

  async createDraft(createDraftDto: CreateDraftDto, ownerId: string) {
    // Check owner profile is valid 
    const owner = await this.prismaService.ownerProfile.findFirst({
      where: {
        accountId: ownerId
      }
    })
    if (!owner) {
      throw new NotFoundException(`Tài khoản ID: ${ownerId} chưa được cấp quyền chủ hộ`);
    }

    // Check apartment is available or not 
    const apartment = await this.prismaService.apartment.findFirst({
      where: {
        id: createDraftDto.apartmentId,
        ownerId: owner.id,
        apartmentStatus: "Available"
      }
    })

    if (!apartment) {
      throw new ForbiddenException("Căn hộ không tồn tại")
    }

    const tenantId = createDraftDto.tenantId

    const tenantProfile = await this.prismaService.tenantProfile.findFirst({
      where: {
        accountId: tenantId,
      }
    })

    if (!tenantProfile) {
      throw new NotFoundException(`Tài khoản ID: ${createDraftDto.tenantId} chưa được cấp quyền chủ hộ`);
    }

    await this.prismaService.contract.create({
      data: {
        rentPrice: new Prisma.Decimal(createDraftDto.rentPrice),
        deposit: new Prisma.Decimal(createDraftDto.deposit),
        terms: createDraftDto.terms,
        startDate: new Date(createDraftDto.startDate),
        endDate: new Date(createDraftDto.endDate),
        apartmentId: createDraftDto.apartmentId,
        ownerId: owner.id,
        tenantId: tenantProfile.id,
      }
    })

    return {
      message: "Hợp đồng đã được tạo"
    }


  }

  async sendToTenant(contractId: string, ownerId: string) {
    const ownerProfile = await this.prismaService.ownerProfile.findUnique({
      where: {
        accountId: ownerId
      }
    })

    const contract = await this.prismaService.contract.findUnique({
      where: {
        id: contractId
      }
    })

    if (contract?.ownerId !== ownerProfile?.id) {
      throw new ForbiddenException("Bạn không có quyền ký hợp đồng")
    }

    if (contract?.contractStatus !== "Draft") {
      throw new BadRequestException("Hợp đồng không trong trạng thái Draft");
    }

    await this.prismaService.contract.update({
      where: {
        id: contract.id
      },
      data: {
        contractStatus: "PendingTenantSignature"
      }
    })

    return 'This action sends contract to tenant, done!!';
  }

  async tenantSign(contractId: string, tenantId: string) {
    const tenantProfile = await this.prismaService.tenantProfile.findUnique({
      where: {
        accountId: tenantId
      }
    })

    if (!tenantProfile) {
      throw new ForbiddenException("Bạn chưa có được kích hoạt quyền công dân")
    }

    const contract = await this.prismaService.contract.findUnique({
      where: {
        id: contractId
      }
    })

    if (contract?.tenantId !== tenantProfile?.id) {
      throw new ForbiddenException("Bạn không có quyền ký hợp đồng")
    }

    if (contract?.contractStatus !== "PendingTenantSignature") {
      throw new BadRequestException("Hợp đồng không trong trạng thái PendingTenantSignature");
    }

    await this.prismaService.$transaction([
      this.prismaService.contract.update({
        where: {
          id: contractId
        },
        data: {
          contractStatus: "Active",
          signAt: new Date(),
        }
      }),

      this.prismaService.apartment.update({
        where: {
          id: contract.apartmentId
        },
        data: {
          apartmentStatus: "Rented"
        }
      })
    ])

    return 'This action signs contract';
  }

  async activateTenantProfile(tenantAccountId: string) {
    const tenantProfile = await this.prismaService.tenantProfile.findUnique({
      where: { accountId: tenantAccountId }
    });

    if (!tenantProfile) {
      throw new ForbiddenException("Không tìm thấy hồ sơ khách thuê");
    }

    const activeContract = await this.prismaService.contract.findFirst({
      where: {
        tenantId: tenantProfile.id,
        contractStatus: "Active"
      }
    });

    if (!activeContract) {
      throw new BadRequestException("Bạn phải có ít nhất một hợp đồng có hiệu lực (Active) để kích hoạt tài khoản");
    }

    await this.prismaService.tenantProfile.update({
      where: { id: tenantProfile.id },
      data: { isActive: true }
    });

    return { success: true, message: "Tài khoản của bạn đã được kích hoạt thành công!" };
  }

  async tenantReject(contractId: string, tenantId: string) {
    const tenantProfile = await this.prismaService.tenantProfile.findUnique({
      where: { accountId: tenantId }
    });

    if (!tenantProfile) {
      throw new ForbiddenException("Bạn chưa có quyền cư dân");
    }

    const contract = await this.prismaService.contract.findUnique({
      where: { id: contractId }
    });

    if (contract?.tenantId !== tenantProfile?.id) {
      throw new ForbiddenException("Bạn không có quyền thực hiện hành động này");
    }

    if (contract?.contractStatus !== "PendingTenantSignature") {
      throw new BadRequestException("Hợp đồng không trong trạng thái chờ ký");
    }

    await this.prismaService.contract.update({
      where: { id: contractId },
      data: { contractStatus: "RejectedByTenant" }
    });

    return { message: "Đã từ chối bản nháp hợp đồng" };
  }

  async terminateEarly(contractId: string, reason: string, tenantAccountId: string) {
    const tenantProfile = await this.prismaService.tenantProfile.findUnique({
      where: {
        accountId: tenantAccountId
      }
    })

    if (!tenantProfile) {
      throw new ForbiddenException("Bạn chưa có được kích hoạt quyền công dân")
    }

    const contract = await this.prismaService.contract.findUnique({
      where: {
        id: contractId
      }
    })

    if (contract?.tenantId !== tenantProfile?.id) {
      throw new ForbiddenException("Bạn không có quyền ký hợp đồng")
    }

    if (contract?.contractStatus !== "Active") {
      throw new BadRequestException("Hợp đồng không trong trạng thái Active");
    }

    await this.prismaService.contract.update({
      where: {
        id: contract.id
      },
      data: {
        contractStatus: "TerminationRequested",
        terminationReason: reason
      }
    })

    return 'This action terminates contract';
  }

  async approveTermination(contractId: string, ownerAccountId: string) {

    const ownerProfile = await this.prismaService.ownerProfile.findUnique({
      where: {
        accountId: ownerAccountId
      }
    })

    if (!ownerProfile) {
      throw new ForbiddenException("Bạn chưa có quyền naỳ");
    }

    const contract = await this.prismaService.contract.findUnique({
      where: {
        id: contractId
      }
    })

    if (contract?.contractStatus !== 'TerminationRequested') {
      throw new ForbiddenException("Hợp đồng không trong trạng thái yêu cầu chấm dứt")
    }

    if (contract?.ownerId !== ownerProfile?.id) {
      throw new ForbiddenException("Bạn không có quyền duyệt hợp đồng này")
    }

    await this.prismaService.$transaction([
      this.prismaService.contract.update({
        where: {
          id: contractId
        },
        data: {
          contractStatus: 'Terminated',
          terminateAt: new Date()
        }
      }),
      this.prismaService.apartment.update({
        where: {
          id: contract.apartmentId,
        },
        data: {
          apartmentStatus: "Available"
        }
      }),
      this.prismaService.tenantProfile.update({
        where: {
          id: contract.tenantId,
        },
        data: {
          isActive: false
        }
      })
    ])
  }

  async findAll(accountId: string) {
    // Determine if the account is an owner or a tenant
    const ownerProfile = await this.prismaService.ownerProfile.findUnique({
      where: { accountId }
    });
    
    const tenantProfile = await this.prismaService.tenantProfile.findUnique({
      where: { accountId }
    });

    return this.prismaService.contract.findMany({
      where: {
        OR: [
          ownerProfile ? { ownerId: ownerProfile.id } : {},
          tenantProfile ? { tenantId: tenantProfile.id } : {}
        ]
      },
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
            }
          }
        },
        tenant: { include: { account: true } },
        owner: { include: { account: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  findOne(id: string) {
    return `This action returns a #${id} contract`;
  }

  update(id: string, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: string) {
    return `This action removes a #${id} contract`;
  }
}
