import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, PaymentType, PaymentMethod } from '@prisma/client';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let prisma: PrismaService;

  const mockPrismaService = {
    payment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    contract: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should throw NotFoundException if contract does not exist', async () => {
      mockPrismaService.contract.findUnique.mockResolvedValue(null);

      await expect(service.findAll({ ownerProfileId: 'owner-1' }, 'contract-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user has no access to contract', async () => {
      mockPrismaService.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        ownerId: 'owner-2',
        tenantId: 'tenant-2',
      });

      await expect(
        service.findAll(
          { ownerProfileId: 'owner-1', tenantProfileId: 'tenant-1' },
          'contract-1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should query by contractId if authorized', async () => {
      const mockPayments = [{ id: 'payment-1' }];
      mockPrismaService.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        ownerId: 'owner-1',
        tenantId: 'tenant-1',
      });
      mockPrismaService.payment.findMany.mockResolvedValue(mockPayments);

      const result = await service.findAll(
        { ownerProfileId: 'owner-1', tenantProfileId: 'tenant-1' },
        'contract-1',
      );

      expect(result).toEqual(mockPayments);
      expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { contractId: 'contract-1' },
        }),
      );
    });
  });

  describe('confirmPayment', () => {
    it('should throw NotFoundException if payment does not exist', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.confirmPayment('payment-1', 'owner-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if ownerProfileId does not match', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        contract: { ownerId: 'owner-2' },
      });

      await expect(service.confirmPayment('payment-1', 'owner-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if payment is already Paid', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        status: PaymentStatus.Paid,
        contract: { ownerId: 'owner-1' },
      });

      await expect(service.confirmPayment('payment-1', 'owner-1')).rejects.toThrow(BadRequestException);
    });

    it('should update payment status to Paid when valid', async () => {
      const mockPayment = {
        id: 'payment-1',
        status: PaymentStatus.Pending,
        contract: { ownerId: 'owner-1' },
      };
      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrismaService.payment.update.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.Paid,
      });

      const result = await service.confirmPayment('payment-1', 'owner-1');

      expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: {
          status: PaymentStatus.Paid,
          method: PaymentMethod.BankTransfer,
          paymentDate: expect.any(Date),
        },
      });
    });
  });
});
