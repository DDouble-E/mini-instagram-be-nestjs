import { ArgumentsHost, Logger, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    this.logger.error('Exception caught by HttpExceptionFilter:');

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`
    );

    response.status(status).json({
      success: false,
      code: status,
      path: request.url,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message,
      timestamp: new Date().toISOString(),
    });
  }
}