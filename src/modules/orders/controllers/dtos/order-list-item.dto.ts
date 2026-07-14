import { ApiProperty } from '@nestjs/swagger';

export class OrderListItemDto {
    @ApiProperty({ example: 1001 })
    order_id: number;

    @ApiProperty({ example: 'john@example.com' })
    customer_email: string;

    @ApiProperty({ example: 120.5 })
    total_price: number;

    @ApiProperty({ example: 3 })
    items_count: number;

    @ApiProperty({ example: '2026-03-10T18:30:00Z' })
    created_at: Date;
}
