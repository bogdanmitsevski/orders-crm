import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './common/config/app';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AnalyticsModule } from './modules/analytics/domain/analytics.module';

@Module({
  imports: [
    MongooseModule.forRoot(appConfig.mongodbUrl),
    OrdersModule,
    WebhooksModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
