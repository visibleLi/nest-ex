import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
