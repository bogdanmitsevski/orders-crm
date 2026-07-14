import { Injectable } from '@nestjs/common';
import { OrdersService } from '../../orders/domain/orders.service';
import { Order } from '../../orders/db/order.schema';
import { OrderDto } from '../controllers/dtos/order.dto';

@Injectable()
export class WebhooksService {
    constructor(private readonly orderService: OrdersService) {}

    handleOrderWebhook(orderDto: OrderDto): Promise<Order> {
        const order: Order = {
            order_id: orderDto.order_id,
            customer_email: orderDto.customer_email,
            total_price: orderDto.total_price,
            currency: orderDto.currency,
            items: orderDto.items,
            created_at: new Date(orderDto.created_at),
        };

        return this.orderService.createOrder(order);
    }
}
