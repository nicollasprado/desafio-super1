import { IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString() name: string;
}

export type TCreateServiceDTO = InstanceType<typeof CreateServiceDto>;
