import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the response from the exception
    const exceptionResponse = exception.getResponse();
    
    // Extract the message from the exception response
    let errorMessage: string | string[] = exception.message || 'Internal server error';
    
    // If the exception response is an object with a message property, use that
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exceptionResponseObj = exceptionResponse as any;
      if (exceptionResponseObj.message) {
        errorMessage = exceptionResponseObj.message;
      }
    }
    
    // Ensure errorMessage is always an array
    const messageArray = Array.isArray(errorMessage) ? errorMessage : [errorMessage];

    const errorResponse = {
      statusCode: status,
      message: messageArray
    };

    // Log the full details for debugging
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'HttpExceptionFilter',
      );
    } else {
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(messageArray)}`,
      );
    }

    response.status(status).json(errorResponse);
  }
} 