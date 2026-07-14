
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import {Environment} from "../interfaces/common.interface";
import {attemptEnv} from "../../nest/env";


const getAppConfig = () => {
    const environment: Environment = attemptEnv(
        'NODE_ENV',
        Joi.string()
            .valid(...Object.values(Environment))
            .insensitive()
            .required(),
    );

    const accessSecretKey: string = attemptEnv(
        'ACCESS_SECRET_KEY',
        Joi.string().required(),
    )

    const debug: boolean = attemptEnv('DEBUG', Joi.string().required())

    const host: string = attemptEnv('HOST', Joi.string().required())
    const port: string = attemptEnv('PORT', Joi.string().required())

    const mongodbUrl: string = attemptEnv('MONGODB_URL', Joi.string().required())

    const webhookSecretToken: string = attemptEnv(
        'WEBHOOK_SECRET_TOKEN',
        Joi.string().required(),
    )

    const basicAuthUser: string = attemptEnv(
        'API_BASIC_AUTH_USER',
        Joi.string().required(),
    )
    const basicAuthPassword: string = attemptEnv(
        'API_BASIC_AUTH_PASSWORD',
        Joi.string().required(),
    )


    return {
        accessSecretKey,
        environment,
        debug,
        host,
        port,
        mongodbUrl,
        webhookSecretToken,
        basicAuth: {
            user: basicAuthUser,
            password: basicAuthPassword,
        },

        docs: {
            enabled: true,
            prefix: 'docs',
        },
    };
};

export const appConfig = getAppConfig();

export type AppConfig = typeof appConfig;

export const appConfigFactory = registerAs('app', () => appConfig);
