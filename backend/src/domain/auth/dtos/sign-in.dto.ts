import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaForte123!',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Manter usuário logado com refresh token',
    example: true,
  })
  @IsBoolean()
  rememberMe: boolean;
}

export type TSignInDTO = InstanceType<typeof SignInDto>;
