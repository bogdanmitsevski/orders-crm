import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class OrderItem {
    @ApiProperty({ example: 'TSHIRT-RED' })
    @Prop({ required: true })
    sku: string;

    @ApiProperty({ example: 2 })
    @Prop({ required: true, min: 1 })
    quantity: number;

    @ApiProperty({ example: 40 })
    @Prop({ required: true, min: 0 })
    price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
