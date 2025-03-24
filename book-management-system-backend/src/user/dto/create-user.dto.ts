import { IsNotEmpty, MinLength, ValidateIf } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @MinLength(3,{message:"密码最少3位"})
    bypassword: string;

//   @Validate((value: string) => {
//     if (!value) return '密码不能为空且最少6位';
//     if (value.length < 6) return '密码不能为空且最少6位';
//     return true;
//   })
//   password: string;
}
