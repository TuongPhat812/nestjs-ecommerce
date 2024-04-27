/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly config_service: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const returnedException = exception instanceof HttpException ? exception : new InternalServerErrorException();
    const status = returnedException.getStatus();
    const message = returnedException.message;

    const devErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: {
        name: returnedException.name,
        message: returnedException.message,
        stack: returnedException.stack,
      },
    };

    const prodErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: {
        message,
      },
    };

    const errorResponse = process.env.NODE_ENV === 'production' ? prodErrorResponse : devErrorResponse;

    response.status(status).json(errorResponse);
  }
}
