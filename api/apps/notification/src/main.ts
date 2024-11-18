import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransformInterceptor } from '@app/common-lib';
import { MicroserviceExceptionFilter } from '@app/common-lib/filters/microservice-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const configService = app.get(ConfigService);

  const rmqUri = configService.get('config.rmq.uri');
  const notificationQueue = configService.get('config.queues.notification');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      NotificationModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [rmqUri],
          queue: notificationQueue,
          queueOptions: {
            durable: true,
          },
        },
      },
    );

  microservice.useGlobalInterceptors(new TransformInterceptor());
  microservice.useGlobalFilters(new MicroserviceExceptionFilter());
  microservice.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  await microservice.listen();
}
bootstrap();
