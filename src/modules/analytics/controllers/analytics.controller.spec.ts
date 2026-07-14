import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from '../domain/analytic.service';

describe('AnalyticsController', () => {
    let controller: AnalyticsController;
    let analyticsService: jest.Mocked<AnalyticsService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AnalyticsController],
            providers: [
                {
                    provide: AnalyticsService,
                    useValue: {
                        getAnalytics: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(AnalyticsController);
        analyticsService = module.get(AnalyticsService);
    });

    describe('getAnalytics', () => {
        it('delegates to AnalyticsService and returns its result', async () => {
            const analytics = { total_orders: 2, total_revenue: 161, top_sku: 'TSHIRT-RED' };
            analyticsService.getAnalytics.mockResolvedValue(analytics);

            const result = await controller.getAnalytics();

            expect(analyticsService.getAnalytics).toHaveBeenCalled();
            expect(result).toBe(analytics);
        });
    });
});
