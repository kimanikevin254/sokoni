import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost) {
    let message: string | string[] | object = 'Something went wrong';
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle known exceptions
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      message =
        typeof response === 'string' ? response : (response as any).message;
      statusCode = exception.getStatus();
    } else if (exception instanceof RpcException) {
      message = exception.getError();
    }

    const error = { statusCode, message };

    return throwError(() => ({ error }));
  }
}
