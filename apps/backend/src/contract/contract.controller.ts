import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { CreateDraftDto } from './dto/create-draft.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequireProfile } from 'src/auth/decorators/require-profile.decorator';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Post('create-draft')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  createDraft(@Body() createDraftDto: CreateDraftDto, @Req() req) {
    const ownerId = req.user.accountId;
    return this.contractService.createDraft(createDraftDto, ownerId);
  }

  @Post('send-to-tenant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  sendToTenant(@Req() req) {
    const { contractId } = req.body;
    const ownerId = req.user.accountId
    return this.contractService.sendToTenant(contractId, ownerId);
  }

  @Post("tenant-sign")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('TENANT')
  tenantSign(@Req() req) {
    const { contractId } = req.body;
    const tenantId = req.user.accountId
    return this.contractService.tenantSign(contractId, tenantId);
  }

  @Post("activate-tenant")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('TENANT')
  activateTenant(@Req() req) {
    const tenantId = req.user.accountId;
    return this.contractService.activateTenantProfile(tenantId);
  }

  @Post("tenant-reject")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('TENANT')
  tenantReject(@Req() req) {
    const { contractId } = req.body;
    const tenantId = req.user.accountId
    return this.contractService.tenantReject(contractId, tenantId);
  }

  @Post("terminate-early")
  @UseGuards(JwtAuthGuard)
  terminateEarly(@Req() req) {
    const { contractId, reason } = req.body
    const tenantAccountId = req.user.accountId;
    return this.contractService.terminateEarly(contractId, reason, tenantAccountId);
  }

  @Post("approve-termination")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  approveTermination(@Req() req) {
    const { contractId } = req.body;
    const ownerId = req.user.accountId
    return this.contractService.approveTermination(contractId, ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.contractService.findAll(req.user.accountId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.update(id, updateContractDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }
}
