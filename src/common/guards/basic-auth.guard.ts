import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { appConfig } from '../config/app';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const header: string | undefined = request.headers['authorization'];

        if (!header?.startsWith('Basic ')) {
            response.header('WWW-Authenticate', 'Basic');
            throw new UnauthorizedException('Missing Basic Authorization header');
        }

        const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf-8');
        const separatorIndex = decoded.indexOf(':');
        const user = decoded.slice(0, separatorIndex);
        const password = decoded.slice(separatorIndex + 1);

        const isValid =
            user === appConfig.basicAuth.user && password === appConfig.basicAuth.password;

        if (!isValid) {
            response.header('WWW-Authenticate', 'Basic');
            throw new UnauthorizedException('Invalid credentials');
        }

        return true;
    }
}
