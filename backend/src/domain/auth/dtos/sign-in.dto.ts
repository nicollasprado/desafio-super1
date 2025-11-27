import { IsBoolean, IsString } from 'class-validator';

export class SignInDto {
  @IsString() email: string;
  @IsString() password: string;
  @IsBoolean() rememberMe: boolean;
}

export type TSignInDTO = InstanceType<typeof SignInDto>;
