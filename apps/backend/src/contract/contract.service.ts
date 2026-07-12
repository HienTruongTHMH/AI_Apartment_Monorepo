import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApartmentStatus } from '@prisma/client';


@Injectable()
export class ContractService {

  constructor(private readonly prismaService: PrismaService) { }

  create(createContractDto: CreateContractDto) {
    return 'This action adds a new contract';
  }

  createDraft(createDraftDto: CreateContractDto, ownerId: string, apartmentId: string) {
    if (!apartmentId) {
      throw new ForbiddenException("Căn hộ không tồn tại");
    }

    const apartment = this.prismaService.apartment.findUniqueOrThrow({
      where: {
        id: apartmentId
      }
    })

    // Xác minh apartment status


  }

  sendToTenant(contractId: string, ownerId: string) {
    return 'This action sends contract to tenant';
  }

  tenantSign(contractId: string, tenantId: string) {
    return 'This action signs contract';
  }

  terminateEarly(contractId: string, reason: string) {

  }

  findAll() {
    return `This action returns all contract`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
