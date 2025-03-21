import { Module, DynamicModule } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';

// @Module({
//   controllers: [BbbController],
//   providers: [BbbService],
// })
// export class BbbModule {}

@Module({})
export class BbbModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: BbbModule,
      controllers: [BbbController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        BbbService,
      ],
      exports: [],
    };
  }
}
