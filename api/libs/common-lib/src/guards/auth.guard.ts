import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomRpcException } from '../utils/custom-rpc-exception';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToRpc().getData();

    console.log('received request', request);

    // return false;
    throw new CustomRpcException({
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Forbidden',
    });
  }
}
