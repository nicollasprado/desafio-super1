import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do tipo de serviço',
    example: 'Pintura Residencial',
  })
  @IsString()
  name: string;
}

export type TCreateServiceDTO = InstanceType<typeof CreateServiceDto>;
