import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { WebhooksController } from './controllers/webhooks.controller';
import { WebhooksService } from './domain/webhooks.service';

@Module({
    imports: [OrdersModule],
    controllers: [WebhooksController],
    providers: [WebhooksService],
})
export class WebhooksModule {}
