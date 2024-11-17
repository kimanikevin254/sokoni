import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransformInterceptor } from '@app/common-lib/interceptors/transform-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceExceptionFilter } from '@app/common-lib/filters/microservice-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  const configService = app.get(ConfigService);

  const rmqUri = configService.get('config.rmq.uri');
  const userQueue = configService.get('config.queues.user');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUri],
      queue: userQueue,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new MicroserviceExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
}
bootstrap();
