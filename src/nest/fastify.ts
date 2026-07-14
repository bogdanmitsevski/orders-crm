import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { parse } from 'qs';
import {appConfig} from "../common/config/app";

export async function createFastifyApp(rootModule: any): Promise<NestFastifyApplication> {
    const config = appConfig;
    const adapter = new FastifyAdapter({
        logger: config.debug,
        http2SessionTimeout: 30000,
        querystringParser: parse,
    } as any);

    const app = await NestFactory.create<NestFastifyApplication>(rootModule, adapter, {
        logger: ['debug', 'error', 'log', 'verbose', 'warn'],
    });

    app.enableCors();

    return app;
}
