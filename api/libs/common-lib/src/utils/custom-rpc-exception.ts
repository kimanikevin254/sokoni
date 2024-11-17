import { RpcException } from '@nestjs/microservices';
import { RpcError } from '../interfaces/rpc-error.interface';

export class CustomRpcException extends RpcException {
  constructor(error: RpcError) {
    super(error);
  }
}
