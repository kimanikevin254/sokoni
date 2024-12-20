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

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUri],
        queue: userQueue,
        queueOptions: {
          durable: true,
        },
      },
    });

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
