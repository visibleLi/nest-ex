import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbservice: DbService;

  async create(createUserDto: CreateUserDto) {
    const users: User[] = await this.dbservice.read();
    const findUser = users.find(
      (user) => user.username === createUserDto.username,
    );
    if (findUser) {
      throw new BadRequestException('该用户已经注册');
    }
    const user = new User();
    user.username = createUserDto.username;
    user.bypassword = createUserDto.bypassword;
    users.push(user);
    await this.dbservice.write(users);
    return user;
    //return 'This action adds a new user';
  }

  async findAll() {
    const users: User[] = await this.dbservice.read();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async login(loginUserDto:LoginUserDto){
    console.log('wpp');
    const users: User[] = await this.dbservice.read();
    const findUser = users.find(
      (user) => user.username === loginUserDto.username,
    );
    if (!findUser) {
      throw new BadRequestException('该用户不存在');
    }
    if(findUser.bypassword !== loginUserDto.bypassword){
      throw new BadRequestException('密码错误');
    }
    return findUser;
  }
}
