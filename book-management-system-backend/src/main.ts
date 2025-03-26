import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换参数类型
      whitelist: true, // 过滤掉未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性
    }),
  );
  app.useStaticAssets(join(__dirname, '../uploads'), {prefix: '/uploads'});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
