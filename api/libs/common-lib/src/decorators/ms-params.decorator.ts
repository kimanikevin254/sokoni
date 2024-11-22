import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MsParams = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToRpc().getData();
    return data ? request.params[data] : request.params;
  },
);
