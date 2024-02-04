import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const isMobileUserAgent = (request: Request) => {
  const userAgent = request.headers['user-agent'] || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  return isMobile;
};
export const IsMobileDevice = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const isMobile = isMobileUserAgent(request);

    return isMobile;
  },
);
