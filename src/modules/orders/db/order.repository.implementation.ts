import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdersRepository } from '../domain/orders.repository';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrderRepositoryImplementation extends OrdersRepository {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    ) {
        super();
    }

    async create(order: Order): Promise<Order> {
        try {
            const created = await this.orderModel.create(order);
            return created.toObject();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException(
                    `Order with order_id ${order.order_id} already exists`,
                );
            }
            throw error;
        }
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().sort({ created_at: -1 }).lean();
    }
}
