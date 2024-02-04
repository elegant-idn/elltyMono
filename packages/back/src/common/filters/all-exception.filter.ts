import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { logger } from '../utils/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    logger.error({
      err: exception,
      stack: (exception as any)?.errors?.hash?.stack,
    });
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let defaultResponse = {};

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      defaultResponse = exception.getResponse();
    }

    response.status(status).json({
      message: (exception as HttpException).message || 'Internal Error',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...defaultResponse,
    });
  }
}
