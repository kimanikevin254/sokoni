import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiGatewayExceptionFilter } from './filters/gateway-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ApiGatewayExceptionFilter(app.get(HttpAdapterHost)));
  await app.listen(3000);
}
bootstrap();
