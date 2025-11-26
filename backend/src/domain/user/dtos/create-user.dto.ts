import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail() email!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsOptional() @IsPhoneNumber('BR') phone?: string;
  @IsStrongPassword() password: string;
}

export type TCreateUserDto = InstanceType<typeof CreateUserDto>;
