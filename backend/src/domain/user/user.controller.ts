import { Body, Controller, Post } from '@nestjs/common';
import UserService from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { TUserDTO } from './dtos/user.dto';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<TUserDTO> {
    return await this.userService.create(data);
  }
}
