import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { Order } from '../db/order.schema';

describe('OrdersService', () => {
    let service: OrdersService;
    let repository: jest.Mocked<OrdersRepository>;

    const order: Order = {
        order_id: 1001,
        customer_email: 'john@example.com',
        total_price: 120.5,
        currency: 'USD',
        items: [{ sku: 'TSHIRT-RED', quantity: 2, price: 40 }],
        created_at: new Date('2026-03-10T18:30:00Z'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                {
                    provide: OrdersRepository,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(OrdersService);
        repository = module.get(OrdersRepository);
    });

    describe('createOrder', () => {
        it('delegates to the repository and returns the created order', async () => {
            repository.create.mockResolvedValue(order);

            const result = await service.createOrder(order);

            expect(repository.create).toHaveBeenCalledWith(order);
            expect(result).toBe(order);
        });
    });

    describe('listOrders', () => {
        it('delegates to the repository and returns all orders', async () => {
            repository.findAll.mockResolvedValue([order]);

            const result = await service.listOrders();

            expect(repository.findAll).toHaveBeenCalled();
            expect(result).toEqual([order]);
        });
    });
});
