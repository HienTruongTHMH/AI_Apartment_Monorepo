import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AIBroker Module - Architectural Vulnerabilities (e2e)', () => {
    jest.setTimeout(40000);
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('VULNERABILITY EXPOSED: Lack of Fallback & Retry in AI Search when AI service is down', async () => {
        // [SCENARIO] 
        // FastAPI (Python AI Server) hiện không chạy trong môi trường test này (ECONNREFUSED).
        // Nếu hệ thống được thiết kế đúng chuẩn Microservices (có Retry/Circuit Breaker/Fallback), 
        // thì khi AI sập, hệ thống phải tự động fallback sang "query chay PostgreSQL" và trả về HTTP 200.
        // Nhưng do lỗ hổng thiết kế, lỗi sẽ bị bắn thẳng ra ngoài thành HTTP 503.

        // [ACTION] Gửi yêu cầu tìm kiếm nhà tới AI Broker
        const payload = {
            query: "Tìm chung cư quận 1 giá rẻ",
            tenant_id: "test-tenant-uuid",
        };

        const response = await request(app.getHttpServer())
            .post('/ai-agents/search')
            .send(payload);

        // [ASSERTION - CHỨNG MINH LỖ HỔNG]
        // Kì vọng hệ thống sẽ văng lỗi 5xx (503 hoặc 504) thay vì trả về 200 (Fallback thành công)
        expect(response.status).toBeGreaterThanOrEqual(500);
    }, 40000);

    afterAll(async () => {
        await app.close();
    });
});
