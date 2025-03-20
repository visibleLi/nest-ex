import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Aaa ,Bbb } from './aaa.decorator';
import { AaaGuard } from './aaa.guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @Aaa('admin')
  @Bbb('hello','admin')
  //@SetMetadata('aaa','admin')
  //@UseGuards(AaaGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
