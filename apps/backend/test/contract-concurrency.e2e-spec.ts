import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

describe('Contract Module - Architectural Vulnerabilities (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    // Khai báo các ID dùng để giả lập dữ liệu test
    const testAccountId = 'test-tenant-account-id';
    let testTenantProfileId: string;
    let testOwnerId: string;
    let testApartmentId: string;
    let testContractId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // Bỏ qua Auth để tập trung vào kiểm thử Concurrency tại tầng Service/Database
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { accountId: testAccountId }; // Giả lập req.user
                    return true;
                },
            })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: () => true,
            })
            .compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get<PrismaService>(PrismaService);
        await app.init();

        // -- SETUP SEED DATA TRỰC TIẾP VÀO DB ĐỂ PHỤC VỤ TEST --
        // 0. Tạo Account
        await prisma.account.createMany({
            data: [
                { id: testAccountId, email: "tenant@test.com", hashedPassword: "hash", phone: "0123456789" },
                { id: 'test-owner-account-id', email: "owner@test.com", hashedPassword: "hash", phone: "0987654321" }
            ],
            skipDuplicates: true
        });

        // 1. Tạo Tenant Profile
        const tenant = await prisma.tenantProfile.create({
            data: { accountId: testAccountId, fullName: "Test Tenant", isActive: false },
        });
        testTenantProfileId = tenant.id;

        // 2. Tạo Owner Profile
        const owner = await prisma.ownerProfile.create({
            data: { accountId: 'test-owner-account-id', fullName: "Test Owner" },
        });
        testOwnerId = owner.id;

        // 3. Tạo Apartment
        const apartment = await prisma.apartment.create({
            data: {
                ownerId: testOwnerId,
                floor: 1,
                area: 50,
                apartmentStatus: 'Available',
            },
        });
        testApartmentId = apartment.id;
    });

    afterAll(async () => {
        // Dọn dẹp dữ liệu và đóng kết nối an toàn
        if (testContractId) {
            await prisma.payment.deleteMany({ where: { contractId: testContractId } });
            await prisma.contract.deleteMany({ where: { id: testContractId } });
        }
        if (testApartmentId) await prisma.apartment.deleteMany({ where: { id: testApartmentId } });
        if (testOwnerId) await prisma.ownerProfile.deleteMany({ where: { id: testOwnerId } });
        if (testTenantProfileId) await prisma.tenantProfile.deleteMany({ where: { id: testTenantProfileId } });

        await prisma.account.deleteMany({ where: { id: { in: [testAccountId, 'test-owner-account-id'] } } });
        await app.close();
    });

    it('VULNERABILITY EXPOSED: Race Condition in tenantSign endpoint', async () => {
        // [PREPARE] Tạo một Contract ở trạng thái PendingTenantSignature
        const contract = await prisma.contract.create({
            data: {
                rentPrice: 1000,
                deposit: 1000,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                apartmentId: testApartmentId,
                ownerId: testOwnerId,
                tenantId: testTenantProfileId,
                contractStatus: 'PendingTenantSignature', // Trạng thái hợp lệ để ký
            },
        });
        testContractId = contract.id;

        // [ACTION] Gửi 2 HTTP POST requests ĐỒNG THỜI (Concurrent)
        const req1 = request(app.getHttpServer())
            .post('/contract/tenant-sign')
            .send({ contractId: testContractId });

        const req2 = request(app.getHttpServer())
            .post('/contract/tenant-sign')
            .send({ contractId: testContractId });

        // Sử dụng Promise.all để đảm bảo không có độ trễ giữa 2 request, ép Race Condition xảy ra
        const [response1, response2] = await Promise.all([req1, req2]);

        // [ASSERTION - XÁC NHẬN FIX LỖI]
        const statuses = [response1.status, response2.status].sort();
        
        // Sẽ có chính xác 1 request thành công (200/201) và 1 request thất bại bị chặn lại (400)
        expect(statuses[0]).toBeGreaterThanOrEqual(200);
        expect(statuses[0]).toBeLessThan(300);
        expect(statuses[1]).toBe(400); // <- OCC đã chặn request thứ 2

        // Kể cả DB check cũng sẽ thấy status = 'Active', nhưng transaction đã bị thực hiện 2 lần trùng lặp
        const updatedContract = await prisma.contract.findUnique({
            where: { id: testContractId },
        });
        expect(updatedContract.contractStatus).toBe('Active');
    });
});
