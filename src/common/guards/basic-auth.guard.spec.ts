import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard';
import { appConfig } from '../config/app';

describe('BasicAuthGuard', () => {
    let guard: BasicAuthGuard;
    let setHeader: jest.Mock;

    const createContext = (authorization?: string): ExecutionContext => {
        setHeader = jest.fn();
        return {
            switchToHttp: () => ({
                getRequest: () => ({ headers: { authorization } }),
                getResponse: () => ({ header: setHeader }),
            }),
        } as unknown as ExecutionContext;
    };

    const encode = (user: string, password: string) =>
        `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;

    beforeEach(() => {
        guard = new BasicAuthGuard();
    });

    it('allows the request when credentials match the configured values', () => {
        const context = createContext(encode(appConfig.basicAuth.user, appConfig.basicAuth.password));

        expect(guard.canActivate(context)).toBe(true);
    });

    it('rejects the request when the Authorization header is missing', () => {
        const context = createContext(undefined);

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
        expect(setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic');
    });

    it('rejects the request when the scheme is not Basic', () => {
        const context = createContext('Bearer some-token');

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('rejects the request when the password is wrong', () => {
        const context = createContext(encode(appConfig.basicAuth.user, 'wrong-password'));

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('rejects the request when the user is wrong', () => {
        const context = createContext(encode('someone-else', appConfig.basicAuth.password));

        expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
});
