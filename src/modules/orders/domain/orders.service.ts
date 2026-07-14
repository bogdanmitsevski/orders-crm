import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from '../db/order.schema';

@Injectable()
export class OrdersService {
    constructor(private readonly orderRepository: OrdersRepository) {}

    createOrder(order: Order): Promise<Order> {
        return this.orderRepository.create(order);
    }

    listOrders(): Promise<Order[]> {
        return this.orderRepository.findAll();
    }
}
