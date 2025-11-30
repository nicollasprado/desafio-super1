import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import UserService from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { TUserDTO } from './dtos/user.dto';

@ApiTags('Usuários')
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Registra um novo usuário no sistema',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'maria.santos@email.com',
        firstName: 'Maria',
        lastName: 'Santos',
        phone: '+5511987654321',
        avatarUrl: null,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  @Post()
  async create(@Body() data: CreateUserDto): Promise<TUserDTO> {
    return await this.userService.create(data);
  }
}
