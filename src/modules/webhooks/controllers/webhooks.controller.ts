import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderDto } from './dtos/order.dto';
import { WebhooksService } from '../domain/webhooks.service';
import { WebhookTokenGuard } from '../guards/webhook-token.guard';
import { Order } from '../../orders/db/order.schema';

@ApiTags('webhooks')
@ApiHeader({
    name: 'x-webhook-token',
    description: 'Shared secret used to authenticate incoming webhook requests',
    required: true,
})
@Controller('webhook')
export class WebhooksController {
    constructor(private readonly webhookService: WebhooksService) {}

    @Post('order')
    @UseGuards(WebhookTokenGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Receive an order from an external system' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Order stored successfully', type: Order })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Payload failed validation' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid x-webhook-token header' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'An order with the same order_id already exists' })
    receiveOrder(@Body() orderDto: OrderDto): Promise<Order> {
        return this.webhookService.handleOrderWebhook(orderDto);
    }
}
