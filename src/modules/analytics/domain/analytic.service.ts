import { Injectable } from '@nestjs/common';
import { OrdersService } from '../../orders/domain/orders.service';
import { AnalyticsDto } from '../controllers/dtos/analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(private readonly ordersService: OrdersService) {}

    async getAnalytics(): Promise<AnalyticsDto> {
        const orders = await this.ordersService.listOrders();

        const total_orders = orders.length;
        const total_revenue =
            Math.round(orders.reduce((sum, order) => sum + order.total_price, 0) * 100) / 100;

        const skuQuantities = new Map<string, number>();
        for (const order of orders) {
            for (const item of order.items) {
                skuQuantities.set(item.sku, (skuQuantities.get(item.sku) ?? 0) + item.quantity);
            }
        }

        let top_sku: string | null = null;
        let topQuantity = 0;
        for (const [sku, quantity] of skuQuantities) {
            if (quantity > topQuantity) {
                topQuantity = quantity;
                top_sku = sku;
            }
        }

        return { total_orders, total_revenue, top_sku };
    }
}
