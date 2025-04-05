import { AppConstants } from '@/common/constants/app.constants';
import { ExceptionsFilter } from '@/common/exceptions/http-exception.filter';
import { useRequestLogging } from '@/middlewares/logger.middleware';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

const port = process.env.PORT ?? 3001;
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) =>
  origin.trim(),
);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
    cors: true,
  });

  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // If you need to allow cookies or credentials
  });

  useRequestLogging(app);

  app.use(helmet());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)));

  /**
   * @description Global Interceptor
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * @description Global Prefix
   */
  app.setGlobalPrefix(AppConstants.GLOBAL_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.SERVER_URL as string)
    .setBasePath(AppConstants.GLOBAL_PREFIX)
    .setOpenAPIVersion('3.0.0')
    .build();

  const appDocument = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    autoTagControllers: true,
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('/', app, appDocument);

  await app.listen(port);
}

bootstrap().then(() => {
  console.info(
    `Server is running on http://localhost:${port}${AppConstants.GLOBAL_PREFIX}`,
  );
  console.info(`Docs is running on http://localhost:${port}/`);
});
