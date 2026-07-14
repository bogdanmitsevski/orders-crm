import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { OrdersService } from '../../orders/domain/orders.service';
import { OrderDto } from '../controllers/dtos/order.dto';
import { Order } from '../../orders/db/order.schema';

describe('WebhooksService', () => {
    let service: WebhooksService;
    let ordersService: jest.Mocked<OrdersService>;

    const orderDto: OrderDto = {
        order_id: 1001,
        customer_email: 'john@example.com',
        total_price: 120.5,
        currency: 'USD',
        items: [
            { sku: 'TSHIRT-RED', quantity: 2, price: 40 },
            { sku: 'CAP-BLACK', quantity: 1, price: 40.5 },
        ],
        created_at: '2026-03-10T18:30:00Z',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WebhooksService,
                {
                    provide: OrdersService,
                    useValue: {
                        createOrder: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(WebhooksService);
        ordersService = module.get(OrdersService);
    });

    describe('handleOrderWebhook', () => {
        it('maps the webhook payload to an order and stores it', async () => {
            const storedOrder: Order = { ...orderDto, created_at: new Date(orderDto.created_at) };
            ordersService.createOrder.mockResolvedValue(storedOrder);

            const result = await service.handleOrderWebhook(orderDto);

            expect(ordersService.createOrder).toHaveBeenCalledWith({
                order_id: orderDto.order_id,
                customer_email: orderDto.customer_email,
                total_price: orderDto.total_price,
                currency: orderDto.currency,
                items: orderDto.items,
                created_at: new Date(orderDto.created_at),
            });
            expect(result).toBe(storedOrder);
        });

        it('converts created_at from an ISO string into a Date instance', async () => {
            ordersService.createOrder.mockResolvedValue({} as Order);

            await service.handleOrderWebhook(orderDto);

            const passedOrder = ordersService.createOrder.mock.calls[0][0];
            expect(passedOrder.created_at).toBeInstanceOf(Date);
            expect(passedOrder.created_at.toISOString()).toBe('2026-03-10T18:30:00.000Z');
        });

        it('propagates a ConflictException raised for duplicate orders', async () => {
            const conflict = new Error('duplicate');
            ordersService.createOrder.mockRejectedValue(conflict);

            await expect(service.handleOrderWebhook(orderDto)).rejects.toThrow('duplicate');
        });
    });
});
