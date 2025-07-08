import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ExcludeNullsInterceptor } from './common/interceptors/exclude.null.interceptor';
//import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
//import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // 统一响应体格式
  // app.useGlobalInterceptors(
  //   new TransformInterceptor(),
  //   new ExcludeNullsInterceptor(),
  //   new ErrorsInterceptor(),
  //   new TimeoutInterceptor(),
  // );
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  // 注册全局拦截器 (Interceptors) - 响应按逆序执行 去掉ErrorsInterceptor 这个会影响正常业务？
  app.useGlobalInterceptors(
    new TimeoutInterceptor(),       // 1. 最外层，请求时最先生效
    new TransformInterceptor(),     // 2. 响应时，在 ExcludeNulls 之后，最后包装
    new ExcludeNullsInterceptor(),  // 3. 响应时，最先处理 null 值
  );
  // NestJS 的执行顺序：拦截器（Interceptors）的错误处理逻辑 (catchError) 在异常过滤器（Filters）之前执行
  //移除 ErrorsInterceptor，ErrorsInterceptor 会抢先捕获所有异常（包括我们自定义的 BusinessException），并将其粗暴地包装成一个通用的 BadGatewayException
  // 可以删除ErrorsInterceptor文件
  generateDocument(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
