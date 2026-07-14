import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../domain/orders.service';
import { OrderListItemDto } from './dtos/order-list-item.dto';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

@ApiTags('orders')
@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @Get()
    @ApiOperation({ summary: 'List all stored orders' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of stored orders', type: [OrderListItemDto] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid Basic Auth credentials' })
    async listOrders(): Promise<OrderListItemDto[]> {
        const orders = await this.orderService.listOrders();

        return orders.map((order) => ({
            order_id: order.order_id,
            customer_email: order.customer_email,
            total_price: order.total_price,
            items_count: order.items.length,
            created_at: order.created_at,
        }));
    }
}
