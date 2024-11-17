import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MsBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    return request.body;
  },
);
