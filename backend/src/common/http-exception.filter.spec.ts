import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalHttpExceptionFilter } from './http-exception.filter';

describe('GlobalHttpExceptionFilter', () => {
  const makeHost = (request: Partial<Request>, response: Partial<Response>): ArgumentsHost =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    }) as ArgumentsHost;

  it('returns normalized payload for HttpException with requestId', () => {
    const filter = new GlobalHttpExceptionFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const request = {
      requestId: 'req-123',
      method: 'GET',
      originalUrl: '/api/forecasts?period=month',
    } as unknown as Request;

    const response = { status } as unknown as Response;
    const host = makeHost(request, response);

    filter.catch(new HttpException('Forbidden resource', HttpStatus.FORBIDDEN), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'req-123',
        statusCode: HttpStatus.FORBIDDEN,
        error: 'FORBIDDEN',
        message: 'Forbidden resource',
        method: 'GET',
        path: '/api/forecasts?period=month',
      }),
    );
  });

  it('returns 500 payload for unknown exception', () => {
    const filter = new GlobalHttpExceptionFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const request = {
      method: 'POST',
      originalUrl: '/api/subscription/google/verify',
    } as unknown as Request;

    const response = { status } as unknown as Response;
    const host = makeHost(request, response);

    filter.catch(new Error('db unavailable'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'InternalServerError',
        message: 'Internal server error',
        method: 'POST',
        path: '/api/subscription/google/verify',
      }),
    );
  });

  it('uses message array from validation-like error body', () => {
    const filter = new GlobalHttpExceptionFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const request = {
      requestId: 'req-400',
      method: 'POST',
      originalUrl: '/api/auth/login',
    } as unknown as Request;

    const response = { status } as unknown as Response;
    const host = makeHost(request, response);

    filter.catch(
      new HttpException({ message: ['email must be an email'] }, HttpStatus.BAD_REQUEST),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'req-400',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email must be an email'],
      }),
    );
  });
});
