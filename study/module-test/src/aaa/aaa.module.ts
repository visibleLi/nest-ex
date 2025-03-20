import { Module, forwardRef } from '@nestjs/common';
import { BbbModule } from '../bbb/bbb.module';

@Module({
  imports: [forwardRef(() => BbbModule)],
})
export class AaaModule {}
