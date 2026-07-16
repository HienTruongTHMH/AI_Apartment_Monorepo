import { Test, TestingModule } from '@nestjs/testing';
import { BillingCronService } from './billing-cron.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('BillingCronService', () => {
  let service: BillingCronService;

  const mockPrismaService = {
    contract: {
      findMany: jest.fn(),
    },
    payment: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingCronService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BillingCronService>(BillingCronService);
  });

  describe('checkShouldGenerateInvoice', () => {
    it('should generate invoice 4 days before standard billing day', () => {
      // Contract started on 2026-05-15 (billing day 15)
      const startDate = new Date('2026-05-15');
      // Today is 2026-07-11
      const today = new Date('2026-07-11');

      const result = service.checkShouldGenerateInvoice(startDate, today);

      expect(result.shouldGenerate).toBe(true);
      expect(result.dueDate?.getDate()).toBe(15);
      expect(result.dueDate?.getMonth()).toBe(6); // July
    });

    it('should NOT generate invoice on other days', () => {
      const startDate = new Date('2026-05-15');
      const today = new Date('2026-07-10'); // 5 days before

      const result = service.checkShouldGenerateInvoice(startDate, today);

      expect(result.shouldGenerate).toBe(false);
    });

    it('should generate invoice for end of February when billing day is 31st (non-leap year)', () => {
      const startDate = new Date('2026-01-31'); // billing day 31
      const today = new Date('2026-02-24'); // 4 days before Feb 28 (which is last day of Feb)

      const result = service.checkShouldGenerateInvoice(startDate, today);

      expect(result.shouldGenerate).toBe(true);
      expect(result.dueDate?.getDate()).toBe(28);
      expect(result.dueDate?.getMonth()).toBe(1); // Feb
    });

    it('should generate invoice for end of February when billing day is 31st (leap year)', () => {
      const startDate = new Date('2024-01-31'); // billing day 31
      const today = new Date('2024-02-25'); // 4 days before Feb 29 (leap year last day)

      const result = service.checkShouldGenerateInvoice(startDate, today);

      expect(result.shouldGenerate).toBe(true);
      expect(result.dueDate?.getDate()).toBe(29);
      expect(result.dueDate?.getMonth()).toBe(1); // Feb
    });
  });
});
