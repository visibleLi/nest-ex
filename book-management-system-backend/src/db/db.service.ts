import { Inject, Injectable } from '@nestjs/common';
import { DbModuleOptions } from './db.module';
import { access, readFile, writeFile } from 'fs/promises';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: DbModuleOptions;

  async read() {
    try {
      await access(this.options.path);
      const data = await readFile(this.options.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async write(data: any) {
    await writeFile(this.options.path, JSON.stringify(data || []), {
      encoding: 'utf-8',
    });
  }
}
