import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();

    return request.user;
  },
);
