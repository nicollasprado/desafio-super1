import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class ContractServiceBodyDto {
  @ApiProperty({
    description: 'ID do usuário que está contratando o serviço',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  contractorId: string;

  @ApiProperty({
    description: 'Data e hora de início do serviço (formato ISO 8601)',
    example: '2024-12-15T10:00:00.000Z',
  })
  @IsDateString()
  start: string;
}

export type TContractServiceDTO = InstanceType<
  typeof ContractServiceBodyDto
> & { variantId: string };
