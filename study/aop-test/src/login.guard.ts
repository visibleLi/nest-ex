import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('%cnest-ex/guang/aop-test/src/login.guard.ts:9 object', 'color: #007acc;', context);
    return false;
  }
}
