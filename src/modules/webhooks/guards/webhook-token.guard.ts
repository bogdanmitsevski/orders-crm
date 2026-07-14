import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { appConfig } from '../../../common/config/app';

@Injectable()
export class WebhookTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['x-webhook-token'];

        if (!token || token !== appConfig.webhookSecretToken) {
            throw new UnauthorizedException('Invalid webhook token');
        }

        return true;
    }
}
