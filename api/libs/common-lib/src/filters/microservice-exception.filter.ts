import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { RpcError } from '../interfaces/rpc-error.interface';

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost) {
    let message: string | string[] | object = 'Something went wrong';
    let statusCode: number = 500;

    // Handle known exceptions
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      message =
        typeof response === 'string' ? response : (response as any).message;
      statusCode = exception.getStatus();
    } else if (exception instanceof RpcException) {
      const errorObj = exception.getError() as RpcError;
      message = errorObj.message;
      statusCode = errorObj.statusCode;
    }

    const error = { statusCode, message };

    return throwError(() => ({ error }));
  }
}
