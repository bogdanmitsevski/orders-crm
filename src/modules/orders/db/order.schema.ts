import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { OrderItem, OrderItemSchema } from './order-item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: 'orders', versionKey: false })
export class Order {
    @ApiProperty({ example: 1001 })
    @Prop({ required: true, unique: true })
    order_id: number;

    @ApiProperty({ example: 'john@example.com' })
    @Prop({ required: true })
    customer_email: string;

    @ApiProperty({ example: 120.5 })
    @Prop({ required: true, min: 0 })
    total_price: number;

    @ApiProperty({ example: 'USD' })
    @Prop({ required: true })
    currency: string;

    @ApiProperty({ type: [OrderItem] })
    @Prop({ type: [OrderItemSchema], required: true })
    items: OrderItem[];

    @ApiProperty({ example: '2026-03-10T18:30:00Z' })
    @Prop({ required: true })
    created_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
