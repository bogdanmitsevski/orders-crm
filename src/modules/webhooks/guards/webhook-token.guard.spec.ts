import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { WebhookTokenGuard } from './webhook-token.guard';
import { appConfig } from '../../../common/config/app';

describe('WebhookTokenGuard', () => {
    let guard: WebhookTokenGuard;

    const createContext = (headers: Record<string, string>): ExecutionContext =>
        ({
            switchToHttp: () => ({
                getRequest: () => ({ headers }),
            }),
        }) as unknown as ExecutionContext;

    beforeEach(() => {
        guard = new WebhookTokenGuard();
    });

    it('allows the request when the token matches the configured value', () => {
        const context = createContext({ 'x-webhook-token': appConfig.webhookSecretToken });

        expect(guard.canActivate(context)).toBe(true);
    });

    it('rejects the request when the header is missing', () => {
        const context = createContext({});

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('rejects the request when the token does not match', () => {
        const context = createContext({ 'x-webhook-token': 'wrong-token' });

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
});
