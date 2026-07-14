import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty} from "class-validator";

@Schema({ _id: false })
export class OrderItem {
    @ApiProperty({ example: 'TSHIRT-RED' })
    @Prop({ required: true })
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 2 })
    @Prop({ required: true, min: 1 })
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 40 })
    @Prop({ required: true, min: 0 })
    @IsNotEmpty()
    price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
