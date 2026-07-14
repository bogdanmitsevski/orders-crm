import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../domain/orders.service';
import { Order } from '../db/order.schema';

describe('OrdersController', () => {
    let controller: OrdersController;
    let ordersService: jest.Mocked<OrdersService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: {
                        listOrders: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(OrdersController);
        ordersService = module.get(OrdersService);
    });

    describe('listOrders', () => {
        it('maps stored orders to the list response shape', async () => {
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
            ];
            ordersService.listOrders.mockResolvedValue(orders);

            const result = await controller.listOrders();

            expect(result).toEqual([
                {
                    order_id: 1001,
                    customer_email: 'john@example.com',
                    total_price: 120.5,
                    items_count: 2,
                    created_at: new Date('2026-03-10T18:30:00Z'),
                },
            ]);
        });

        it('returns an empty array when there are no orders', async () => {
            ordersService.listOrders.mockResolvedValue([]);

            const result = await controller.listOrders();

            expect(result).toEqual([]);
        });
    });
});
