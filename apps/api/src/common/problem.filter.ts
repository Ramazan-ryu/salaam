import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

/** Domain error with a stable code, rendered as RFC 9457 Problem Details. */
export class ProblemError extends HttpException {
  constructor(
    status: number,
    readonly code: string,
    detail: string,
    readonly errors?: unknown[],
  ) {
    super(detail, status);
  }
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Problem');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let detail = 'Unexpected error';
    let errors: unknown[] | undefined;

    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_FAILED';
      detail = 'Request validation failed';
      errors = exception.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    } else if (exception instanceof ProblemError) {
      status = exception.getStatus();
      code = exception.code;
      detail = exception.message;
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = HttpStatus[status] ?? 'HTTP_ERROR';
      detail = exception.message;
    } else {
      // Log message only: never request headers or query (may contain approximate location).
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }

    res
      .status(status)
      .type('application/problem+json')
      .json({
        type: `https://salaam.app/problems/${code.toLowerCase()}`,
        title: HttpStatus[status] ?? 'Error',
        status,
        detail,
        code,
        instance: req.path,
        ...(errors ? { errors } : {}),
      });
  }
}
