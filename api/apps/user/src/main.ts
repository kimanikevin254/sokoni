import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransformInterceptor } from '@app/common-lib/interceptors/transform-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceExceptionFilter } from '@app/common-lib/filters/microservice-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:pass@localhost'],
        queue: 'user-queue',
        queueOptions: {
          durabe: true,
        },
      },
    },
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new MicroserviceExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Transform exceptions for better propagation
      // exceptionFactory(errors) {
      //   console.log('Errors', errors);
      //   const messages = errors.map(
      //     (error) =>
      //       `${error.property} - ${Object.values(error.constraints).join(', ')}`,
      //   );
      //   return new RpcException(messages);
      // },
    }),
  );

  await app.listen();
}
bootstrap();
