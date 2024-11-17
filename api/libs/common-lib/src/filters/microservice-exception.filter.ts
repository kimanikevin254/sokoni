import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { RpcError } from '../interfaces/rpc-error.interface';
import { CustomRpcException } from '../utils/custom-rpc-exception';

// ANSI color codes
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost) {
    let message: string | string[] | object = 'Something went wrong';
    let statusCode: number = 500;

    const ctx = host.switchToRpc();

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

    const errorDetails =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as CustomRpcException).getError();
    const messagePattern = ctx.getContext().args[2];

    // Custom colored log format
    const logMessage = `${BOLD}${messagePattern} ${RED}${statusCode} - ${message}${RESET}\n${YELLOW}Error details:${RESET} ${JSON.stringify(errorDetails)}`;
    this.logger.log(logMessage);

    return throwError(() => ({ error }));
  }
}
