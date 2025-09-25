import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('PostService');

  // Get configuration
  const port = configService.get<number>('post.service.port');
  const host = configService.get<string>('post.service.host');

  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port,
    },
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS if needed
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Start microservice
  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`🚀 Post microservice is running on ${host}:${port}`);
}

bootstrap().catch((error) => {
  Logger.error('❌ Failed to start post service', error);
  process.exit(1);
});