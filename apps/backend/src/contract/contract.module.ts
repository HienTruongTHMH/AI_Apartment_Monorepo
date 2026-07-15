import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [ContractController, PaymentController],
  providers: [ContractService],
})
export class ContractModule {}
