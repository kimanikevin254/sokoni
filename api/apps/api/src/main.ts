import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiGatewayExceptionFilter } from './filters/ApiGatewayException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ApiGatewayExceptionFilter(app.get(HttpAdapterHost)));
  await app.listen(3000);
}
bootstrap();
