import { Order } from '../db/order.schema';

export abstract class OrdersRepository {
    abstract create(order: Order): Promise<Order>;
    abstract findAll(): Promise<Order[]>;
}
