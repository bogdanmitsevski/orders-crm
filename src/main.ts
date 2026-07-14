import {createFastifyApp} from "./nest/fastify";
import {AppModule} from "./app.module";
import {BadRequestException, ValidationError, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {appConfig} from "./common/config/app";
import {prettierErrorMessage} from "./utils/validation.utils";


async function bootstrap() {

    const app = await createFastifyApp(AppModule);

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API description')
        .setVersion('1.0')
        .addBasicAuth({
            type: 'http',
            scheme: 'basic',
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        useGlobalPrefix: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => {
                return new BadRequestException(
                    errors.map(prettierErrorMessage).join('; '),
                );
            },
        }),
    );


    await app.listen(appConfig.port, appConfig.host);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
