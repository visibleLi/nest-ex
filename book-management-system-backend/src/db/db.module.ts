import { DynamicModule, Module, Options } from '@nestjs/common';
import { DbService } from './db.service';

export interface DbModuleOptions {
  path: string;
}
@Module({
  //providers: [DbService],
})
export class DbModule {
  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      global: true,
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        DbService,
      ],
      exports: [DbService],
    };
  }
}
