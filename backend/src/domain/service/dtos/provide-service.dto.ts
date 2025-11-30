import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class VariantDto {
  @ApiProperty({
    description: 'Nome da variante do serviço',
    example: 'Pintura de Sala Pequena',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Preço em centavos',
    example: 25000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Duração em minutos',
    example: 120,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  durationMinutes: number;
}

class ScheduleDto {
  @ApiProperty({
    description: 'Dia da semana (0=Domingo, 6=Sábado)',
    example: 1,
    minimum: 0,
    maximum: 6,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;

  @ApiProperty({
    description: 'Hora de início (formato ISO 8601)',
    example: '08:00:00.000Z',
  })
  @IsDateString()
  start: string;

  @ApiProperty({
    description: 'Hora de fim (formato ISO 8601)',
    example: '18:00:00.000Z',
  })
  @IsDateString()
  end: string;
}

export class ProvideServiceDto {
  @ApiProperty({
    description: 'Descrição detalhada do serviço oferecido',
    example: 'Serviço de pintura residencial com materiais inclusos',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID do usuário prestador',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  providerId: string;

  @ApiProperty({
    description: 'ID do tipo de serviço',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    description: 'Lista de variantes do serviço',
    type: [VariantDto],
    example: [
      {
        name: 'Pintura de Sala Pequena',
        price: 25000,
        durationMinutes: 120,
      },
      {
        name: 'Pintura de Sala Grande',
        price: 45000,
        durationMinutes: 240,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

  @ApiProperty({
    description: 'Horários disponíveis para atendimento',
    type: [ScheduleDto],
    example: [
      {
        weekday: 1,
        start: '08:00:00.000Z',
        end: '18:00:00.000Z',
      },
      {
        weekday: 2,
        start: '08:00:00.000Z',
        end: '18:00:00.000Z',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}

export type TProvideServiceDTO = InstanceType<typeof ProvideServiceDto>;
