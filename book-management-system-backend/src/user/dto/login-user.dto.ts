import { IsNotEmpty, MinLength } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(3, { message: '密码最少3位' })
  bypassword: string;
}
