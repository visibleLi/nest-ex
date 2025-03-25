import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ExcludeNullsInterceptor } from './common/interceptors/exclude.null.interceptor';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // 统一响应体格式
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ExcludeNullsInterceptor(),
    new ErrorsInterceptor(),
    new TimeoutInterceptor(),
  );
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  generateDocument(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
