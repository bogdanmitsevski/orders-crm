import { Module } from '@nestjs/common';
import { OrdersModule } from '../../orders/orders.module';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AnalyticsService } from './analytic.service';

@Module({
    imports: [OrdersModule],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule {}
