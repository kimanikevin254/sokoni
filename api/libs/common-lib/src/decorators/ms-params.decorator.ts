import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MsQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    return request.query;
  },
);
