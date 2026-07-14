import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytic.service';
import { OrdersService } from '../../orders/domain/orders.service';
import { Order } from '../../orders/db/order.schema';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let ordersService: jest.Mocked<OrdersService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: OrdersService,
                    useValue: {
                        listOrders: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(AnalyticsService);
        ordersService = module.get(OrdersService);
    });

    it('returns zeroed analytics when there are no orders', async () => {
        ordersService.listOrders.mockResolvedValue([]);

        const result = await service.getAnalytics();

        expect(result).toEqual({ total_orders: 0, total_revenue: 0, top_sku: null });
    });

    it('computes total_orders, total_revenue and top_sku from stored orders', async () => {
        const orders: Order[] = [
            {
                order_id: 1001,
                customer_email: 'john@example.com',
                total_price: 120.5,
                currency: 'USD',
                items: [
                    { sku: 'TSHIRT-RED', quantity: 2, price: 40 },
                    { sku: 'CAP-BLACK', quantity: 1, price: 40.5 },
                ],
                created_at: new Date('2026-03-10T18:30:00Z'),
            },
            {
                order_id: 1002,
                customer_email: 'jane@example.com',
                total_price: 80,
                currency: 'USD',
                items: [{ sku: 'TSHIRT-RED', quantity: 2, price: 40 }],
                created_at: new Date('2026-03-11T10:00:00Z'),
            },
        ];
        ordersService.listOrders.mockResolvedValue(orders);

        const result = await service.getAnalytics();

        expect(result).toEqual({
            total_orders: 2,
            total_revenue: 200.5,
            top_sku: 'TSHIRT-RED',
        });
    });

    it('rounds total_revenue to avoid floating point artifacts', async () => {
        const orders: Order[] = [
            { order_id: 1, total_price: 0.1, currency: 'USD', customer_email: 'a@a.com', items: [], created_at: new Date() },
            { order_id: 2, total_price: 0.2, currency: 'USD', customer_email: 'b@b.com', items: [], created_at: new Date() },
        ];
        ordersService.listOrders.mockResolvedValue(orders);

        const result = await service.getAnalytics();

        expect(result.total_revenue).toBe(0.3);
    });

    it('picks the SKU with the highest total quantity sold, not the most frequent order line', async () => {
        const orders: Order[] = [
            {
                order_id: 1,
                total_price: 10,
                currency: 'USD',
                customer_email: 'a@a.com',
                items: [{ sku: 'A', quantity: 5, price: 1 }],
                created_at: new Date(),
            },
            {
                order_id: 2,
                total_price: 10,
                currency: 'USD',
                customer_email: 'b@b.com',
                items: [
                    { sku: 'B', quantity: 1, price: 1 },
                    { sku: 'B', quantity: 1, price: 1 },
                ],
                created_at: new Date(),
            },
        ];
        ordersService.listOrders.mockResolvedValue(orders);

        const result = await service.getAnalytics();

        expect(result.top_sku).toBe('A');
    });
});
