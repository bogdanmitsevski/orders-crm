import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsDto {
    @ApiProperty({ example: 15 })
    total_orders: number;

    @ApiProperty({ example: 2400.5 })
    total_revenue: number;

    @ApiProperty({ example: 'TSHIRT-RED', nullable: true })
    top_sku: string | null;
}
