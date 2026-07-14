import * as dotenv from 'dotenv';
import { attempt, Schema } from 'joi';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

class EnvVarValidationError extends Error {
    constructor(variableName: string, details: string) {
        super(
            `Environment variable validation error: ${variableName} - ${details}`,
        );
        this.name = 'EnvVarValidationError';
    }
}

export function attemptEnv<T = string>(
    variableName: string,
    schema: Schema,
): T {
    try {
        return attempt(
            process.env[variableName],
            schema,
            `Environment variable ${variableName}`,
        );
    } catch (error) {
        throw new EnvVarValidationError(variableName, error.message);
    }
}
