import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from '../domain/webhooks.service';
import { OrderDto } from './dtos/order.dto';
import { Order } from '../../orders/db/order.schema';

describe('WebhooksController', () => {
    let controller: WebhooksController;
    let webhooksService: jest.Mocked<WebhooksService>;

    const orderDto: OrderDto = {
        order_id: 1001,
        customer_email: 'john@example.com',
        total_price: 120.5,
        currency: 'USD',
        items: [{ sku: 'TSHIRT-RED', quantity: 2, price: 40 }],
        created_at: '2026-03-10T18:30:00Z',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WebhooksController],
            providers: [
                {
                    provide: WebhooksService,
                    useValue: {
                        handleOrderWebhook: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(WebhooksController);
        webhooksService = module.get(WebhooksService);
    });

    describe('receiveOrder', () => {
        it('delegates to WebhooksService and returns the stored order', async () => {
            const storedOrder = { ...orderDto, created_at: new Date(orderDto.created_at) } as Order;
            webhooksService.handleOrderWebhook.mockResolvedValue(storedOrder);

            const result = await controller.receiveOrder(orderDto);

            expect(webhooksService.handleOrderWebhook).toHaveBeenCalledWith(orderDto);
            expect(result).toBe(storedOrder);
        });
    });
});
