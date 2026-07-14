import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './db/order.schema';
import { OrdersRepository } from './domain/orders.repository';
import { OrderRepositoryImplementation } from './db/order.repository.implementation';
import { OrdersService } from './domain/orders.service';
import { OrdersController } from './controllers/orders.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ],
    controllers: [OrdersController],
    providers: [
        OrdersService,
        { provide: OrdersRepository, useClass: OrderRepositoryImplementation },
    ],
    exports: [OrdersService],
})
export class OrdersModule {}
