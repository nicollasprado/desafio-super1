import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'maria.santos@email.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Primeiro nome do usuário',
    example: 'Maria',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Santos',
  })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário (formato brasileiro)',
    example: '+5511987654321',
  })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiProperty({
    description:
      'Senha forte do usuário (mínimo 8 caracteres, maiúsculas, minúsculas, números e símbolos)',
    example: 'SenhaForte123!',
  })
  @IsStrongPassword()
  password: string;
}

export type TCreateUserDto = InstanceType<typeof CreateUserDto>;
