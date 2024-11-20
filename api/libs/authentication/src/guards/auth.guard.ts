import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@app/common-lib/interfaces/user.interface';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getData();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new CustomRpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Forbidden',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user: IUser = { id: payload.sub };

      request['user'] = user;
    } catch {
      throw new CustomRpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Forbidden',
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
