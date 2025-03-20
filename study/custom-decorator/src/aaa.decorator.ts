// import { SetMetadata } from '@nestjs/common';

// export const Aaa = (...args: string[]) => SetMetadata('aaa', args);
import { Get, applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AaaGuard } from './aaa.guard';

export const Aaa = (...args: string[]) => {
  return applyDecorators(SetMetadata('aaa', args), UseGuards(AaaGuard));
};
export function Bbb(path: string, role: string) {
  return applyDecorators(
    Get(path), // 定义路由路径
    Aaa(role), // 定义访问该路由所需的角色
  );
}
