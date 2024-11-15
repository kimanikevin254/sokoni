import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransformInterceptor } from '@app/common-lib/interceptors/transform-response.interceptor';

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

  await app.listen();
}
bootstrap();
