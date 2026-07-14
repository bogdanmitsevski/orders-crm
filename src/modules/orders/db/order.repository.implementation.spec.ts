import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { OrderRepositoryImplementation } from './order.repository.implementation';
import { Order } from './order.schema';

describe('OrderRepositoryImplementation', () => {
    let repository: OrderRepositoryImplementation;
    let orderModel: any;

    const order: Order = {
        order_id: 1001,
        customer_email: 'john@example.com',
        total_price: 120.5,
        currency: 'USD',
        items: [{ sku: 'TSHIRT-RED', quantity: 2, price: 40 }],
        created_at: new Date('2026-03-10T18:30:00Z'),
    };

    beforeEach(async () => {
        orderModel = {
            create: jest.fn(),
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderRepositoryImplementation,
                { provide: getModelToken(Order.name), useValue: orderModel },
            ],
        }).compile();

        repository = module.get(OrderRepositoryImplementation);
    });

    describe('create', () => {
        it('persists the order and returns it as a plain object', async () => {
            const created = { toObject: () => order };
            orderModel.create.mockResolvedValue(created);

            const result = await repository.create(order);

            expect(orderModel.create).toHaveBeenCalledWith(order);
            expect(result).toBe(order);
        });

        it('throws ConflictException when order_id already exists (duplicate key error)', async () => {
            orderModel.create.mockRejectedValue({ code: 11000 });

            await expect(repository.create(order)).rejects.toThrow(ConflictException);
            await expect(repository.create(order)).rejects.toThrow(
                `Order with order_id ${order.order_id} already exists`,
            );
        });

        it('rethrows unrelated errors', async () => {
            const error = new Error('connection lost');
            orderModel.create.mockRejectedValue(error);

            await expect(repository.create(order)).rejects.toThrow('connection lost');
        });
    });

    describe('findAll', () => {
        it('returns all orders sorted by created_at descending', async () => {
            const lean = jest.fn().mockResolvedValue([order]);
            const sort = jest.fn().mockReturnValue({ lean });
            orderModel.find.mockReturnValue({ sort });

            const result = await repository.findAll();

            expect(orderModel.find).toHaveBeenCalled();
            expect(sort).toHaveBeenCalledWith({ created_at: -1 });
            expect(result).toEqual([order]);
        });
    });
});
