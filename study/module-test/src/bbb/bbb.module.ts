import { Module, forwardRef } from '@nestjs/common';
import { AaaModule } from '../aaa/aaa.module';

@Module({
  imports: [forwardRef(() => AaaModule)],
})
export class BbbModule {}
