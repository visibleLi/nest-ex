import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BbbModule } from './bbb/bbb.module';

@Module({
  imports: [BbbModule.register({
    test: '1'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
