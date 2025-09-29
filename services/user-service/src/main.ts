import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('UserService');

  // Get configuration
  const port = configService.get<number>('user.service.port') || 3002;
  const host = configService.get<string>('user.service.host') || '0.0.0.0';
  const tcpPort = configService.get<number>('user.service.tcpPort') || 3012;

  // Configure microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port: tcpPort,
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

  logger.log(`🚀 User service is running on ${host}:${port}`);
  logger.log(`🚀 User microservice (TCP) is running on ${host}:${tcpPort}`);
}

bootstrap().catch(error => {
  Logger.error('❌ Failed to start user service', error);
  process.exit(1);
});
