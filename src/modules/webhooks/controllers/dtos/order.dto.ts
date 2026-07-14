import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsISO8601,
    IsInt,
    IsNumber,
    IsPositive,
    IsString,
    Min,
    ValidateNested, IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({ example: 'TSHIRT-RED' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 40 })
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    price: number;
}

export class OrderDto {
    @ApiProperty({ example: 1001 })
    @IsInt()
    @IsNotEmpty()
    order_id: number;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    @IsNotEmpty()
    customer_email: string;

    @ApiProperty({ example: 120.5 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    total_price: number;

    @ApiProperty({ example: 'USD' })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: '2026-03-10T18:30:00Z' })
    @IsISO8601()
    @IsNotEmpty()
    created_at: string;
}
