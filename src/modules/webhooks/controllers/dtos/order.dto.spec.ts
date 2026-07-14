import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { OrderDto } from './order.dto';

const validPayload = {
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

describe('OrderDto', () => {
    it('passes validation for a well-formed payload', async () => {
        const dto = plainToInstance(OrderDto, validPayload);

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
    });

    it('rejects a non-integer order_id', async () => {
        const dto = plainToInstance(OrderDto, { ...validPayload, order_id: 'not-a-number' });

        const errors = await validate(dto);

        expect(errors.find((e) => e.property === 'order_id')).toBeDefined();
    });

    it('rejects an invalid customer_email', async () => {
        const dto = plainToInstance(OrderDto, { ...validPayload, customer_email: 'not-an-email' });

        const errors = await validate(dto);

        expect(errors.find((e) => e.property === 'customer_email')).toBeDefined();
    });

    it('rejects a negative total_price', async () => {
        const dto = plainToInstance(OrderDto, { ...validPayload, total_price: -5 });

        const errors = await validate(dto);

        expect(errors.find((e) => e.property === 'total_price')).toBeDefined();
    });

    it('rejects an empty items array', async () => {
        const dto = plainToInstance(OrderDto, { ...validPayload, items: [] });

        const errors = await validate(dto);

        expect(errors.find((e) => e.property === 'items')).toBeDefined();
    });

    it('rejects a non-ISO8601 created_at', async () => {
        const dto = plainToInstance(OrderDto, { ...validPayload, created_at: 'not-a-date' });

        const errors = await validate(dto);

        expect(errors.find((e) => e.property === 'created_at')).toBeDefined();
    });

    it('validates nested items and rejects an invalid item', async () => {
        const dto = plainToInstance(OrderDto, {
            ...validPayload,
            items: [{ sku: 'TSHIRT-RED', quantity: -1, price: 40 }],
        });

        const errors = await validate(dto);

        const itemsError = errors.find((e) => e.property === 'items');
        expect(itemsError).toBeDefined();
        expect(itemsError.children[0].children[0].constraints).toHaveProperty('isPositive');
    });
});
