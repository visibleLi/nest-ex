// import { FastifyReply, FastifyRequest } from 'fastify';

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpStatus,
//   ServiceUnavailableException,
//   HttpException,
// } from '@nestjs/common';

// @Catch() //Catch 的参数为空时，默认捕获所有异常
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: Error, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<FastifyReply>();
//     const request = ctx.getRequest<FastifyRequest>();

//     request.log.error(exception);

//     // 非 HTTP 标准异常的处理。
//     response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
//       statusCode: HttpStatus.SERVICE_UNAVAILABLE,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       message: new ServiceUnavailableException().getResponse(),
//     });
//   }
// }


// // 切换为 Express
// // 从 import { FastifyReply, FastifyRequest } from 'fastify'; 改为 import { Request, Response } from 'express';。
// // 将 request.log.error(exception) 改为 console.error(exception)，因为前者是 Fastify 集成日志库后才有的特性。
// // 将 .send() 改为 .json()，这是 Express 中发送 JSON 响应更规范的方式。


/** 以上都注释掉 2025-07-08 采用下方*/

/**
 * @file 全局异常总过滤器 (All-in-One "Commander" Filter)
 * @description
 *
 * [1. 为什么这么改？]
 * 经过深入调试，我们发现当前版本的 NestJS 框架在处理多个全局过滤器时可能存在一个“调度 Bug”，
 * 导致只有使用 @Catch() (无参数) 的过滤器能被稳定触发，状况是其优先级被错误地提升至最高。
 *
 * 为了绕过这个“框架缺陷”，我们采取了将所有异常处理逻辑统一合并到这一个文件中，
 * 使其成为全能的、唯一的异常处理入口。它内部实现了正确的判断顺序：
 *   1. 业务异常 (BusinessException)
 *   2. 其他HTTP异常 (HttpException)
 *   3. 未知服务器错误
 *
 * 因此，原有的 `business.exception.filter.ts` 和 `http.exception.filter.ts`
 * 文件已不再需要，可以从项目中删除，以简化架构。
 */

// [2. 如何切换为 Express？]
// 只需修改下面标记了 [PLATFORM-SWITCH] 的地方即可。

// [PLATFORM-SWITCH] 导入请求/响应类型
// [Fastify]  import { FastifyReply, FastifyRequest } from 'fastify';
// [Express]  import { Request, Response } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  InternalServerErrorException
} from '@nestjs/common';
import { BusinessException } from './business.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    // [PLATFORM-SWITCH] 获取响应对象
    // [Fastify]  const response = ctx.getResponse<FastifyReply>();
    // [Express]  const response = ctx.getResponse<Response>();
    const response = ctx.getResponse<FastifyReply>();

    // [PLATFORM-SWITCH] 获取请求对象
    // [Fastify]  const request = ctx.getRequest<FastifyRequest>();
    // [Express]  const request = ctx.getRequest<Request>();
    const request = ctx.getRequest<FastifyRequest>();


    // 1. 判断业务异常 (BusinessException)
    if (exception instanceof BusinessException) {
      const error = exception.getResponse() as { code: number; message: string };
      // [PLATFORM-SWITCH] 发送响应
      // [Fastify]  response.status(HttpStatus.OK).send({ ... });
      // [Express]  response.status(HttpStatus.OK).json({ ... });
      response.status(HttpStatus.OK).send({
        data: null,
        status: error.code,
        extra: {},
        message: error.message,
        success: false,
      });
      return;
    }

    // 2. 判断其他 HTTP 异常 (HttpException)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      // [PLATFORM-SWITCH] 发送响应
      // [Fastify]  response.status(status).send({ ... });
      // [Express]  response.status(status).json({ ... });
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.getResponse(),
      });
      return;
    }

    // 3. 处理所有其他未知服务器内部错误
    // [PLATFORM-SWITCH] 记录错误日志
    // [Fastify]  request.log.error(exception);
    // [Express]  console.error('Unhandled Internal Server Error:', exception);
    request.log.error(exception);

    // [PLATFORM-SWITCH] 发送响应
    // [Fastify]  response.status(HttpStatus.SERVICE_UNAVAILABLE).send({ ... });
    // [Express]  response.status(HttpStatus.SERVICE_UNAVAILABLE).json({ ... });
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: new InternalServerErrorException().message, // 使用默认的 "Internal Server Error" 消息
    })
  }
}
