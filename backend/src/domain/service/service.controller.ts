import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateServiceDto } from './dtos/create-service.dto';
import ServiceService from './service.service';
import { ProvideServiceDto } from './dtos/provide-service.dto';
import { GetAllProvidedQueryDto } from './dtos/get-all-provided-services.dto';
import { ContractServiceBodyDto } from './dtos/contract-service.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetAllContractedQueryDto } from './dtos/get-all-contracted-services.dto';
import extractTokenFromHeader from 'src/shared/util/extractTokenFromHeader';
import AuthService from '../auth/auth.service';
import type { Request } from 'express';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';

@ApiTags('Serviços')
@Controller('service')
export default class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Criar tipo de serviço',
    description: 'Cria um novo tipo de serviço no sistema',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, description: 'Serviço criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateServiceDto) {
    return await this.serviceService.create(data);
  }

  @ApiOperation({
    summary: 'Listar tipos de serviços',
    description: 'Retorna todos os tipos de serviços cadastrados',
  })
  @ApiResponse({ status: 200, description: 'Lista de serviços' })
  @Get()
  async getAll() {
    return await this.serviceService.getAll();
  }

  @ApiOperation({
    summary: 'Anunciar serviço',
    description:
      'Cria um novo anúncio de serviço com variantes e horários disponíveis',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: ProvideServiceDto,
    examples: {
      pintura: {
        summary: 'Exemplo de serviço de pintura',
        value: {
          description: 'Serviço de pintura residencial com materiais inclusos',
          providerId: '550e8400-e29b-41d4-a716-446655440001',
          serviceId: '550e8400-e29b-41d4-a716-446655440002',
          variants: [
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
          schedules: [
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
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Serviço anunciado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @UseGuards(AuthGuard)
  @Post('provide')
  async provide(@Body() data: ProvideServiceDto) {
    return await this.serviceService.provide(data);
  }

  @ApiOperation({
    summary: 'Listar serviços anunciados',
    description: 'Retorna serviços anunciados com paginação e filtros',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    type: String,
    description: 'Filtrar por tipo de serviço',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca textual',
  })
  @ApiQuery({
    name: 'providerId',
    required: false,
    type: String,
    description: 'Filtrar por prestador',
  })
  @ApiResponse({ status: 200, description: 'Lista de serviços anunciados' })
  @Get('provided')
  async getAllProvided(@Query() query: GetAllProvidedQueryDto) {
    const { page = 1, limit = 10, serviceId, search, providerId } = query;
    return this.serviceService.getAllProvided({
      page,
      limit,
      serviceId,
      search,
      providerId,
    });
  }

  @ApiOperation({
    summary: 'Listar serviços contratados',
    description: 'Retorna serviços contratados do usuário autenticado',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
  })
  @ApiQuery({
    name: 'contractorId',
    required: false,
    type: String,
    description: 'Filtrar por contratante',
  })
  @ApiQuery({
    name: 'providerId',
    required: false,
    type: String,
    description: 'Filtrar por prestador',
  })
  @ApiResponse({ status: 200, description: 'Lista de serviços contratados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @UseGuards(AuthGuard)
  @Get('contracted')
  async getAllContracted(
    @Query() query: GetAllContractedQueryDto,
    @Req() req: Request,
  ) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    const authorId = (await this.authService.describeMe(token)).id;

    const { page = 1, limit = 10, contractorId, providerId } = query;

    if (authorId !== contractorId && authorId !== providerId) {
      throw new ForbiddenException();
    }

    return this.serviceService.getAllContracted({
      page,
      limit,
      providerId,
      contractorId,
    });
  }

  @ApiOperation({
    summary: 'Contratar serviço',
    description: 'Cria uma nova contratação de serviço',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'variantId',
    description: 'ID da variante do serviço',
  })
  @ApiBody({
    type: ContractServiceBodyDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de contratação',
        value: {
          contractorId: '550e8400-e29b-41d4-a716-446655440003',
          start: '2024-12-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Serviço contratado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Horário não disponível' })
  @UseGuards(AuthGuard)
  @Post('provided/variant/:variantId/contract')
  async contract(
    @Param('variantId') variantId: string,
    @Body() data: ContractServiceBodyDto,
  ) {
    return await this.serviceService.contract({ ...data, variantId });
  }

  @ApiOperation({
    summary: 'Aceitar contratação',
    description: 'Prestador aceita uma solicitação de serviço',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'contractedServiceId',
    description: 'ID do serviço contratado',
  })
  @ApiResponse({ status: 200, description: 'Contratação aceita' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Contratação não encontrada' })
  @UseGuards(AuthGuard)
  @Patch('contracted/:contractedServiceId/accept')
  async acceptContract(
    @Param('contractedServiceId') contractedServiceId: string,
    @Req() req: Request,
  ) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    const author = await this.authService.describeMe(token);

    return await this.serviceService.acceptContract(
      contractedServiceId,
      author.id,
    );
  }

  @ApiOperation({
    summary: 'Cancelar contratação',
    description: 'Cancela uma contratação de serviço',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'contractedServiceId',
    description: 'ID do serviço contratado',
  })
  @ApiResponse({ status: 200, description: 'Contratação cancelada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Contratação não encontrada' })
  @UseGuards(AuthGuard)
  @Patch('contracted/:contractedServiceId/cancel')
  async cancelContract(
    @Param('contractedServiceId') contractedServiceId: string,
    @Req() req: Request,
  ) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    const author = await this.authService.describeMe(token);

    return await this.serviceService.acceptContract(
      contractedServiceId,
      author.id,
    );
  }

  @ApiOperation({
    summary: 'Rejeitar contratação',
    description: 'Prestador rejeita uma solicitação de serviço',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'contractedServiceId',
    description: 'ID do serviço contratado',
  })
  @ApiResponse({ status: 200, description: 'Contratação rejeitada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Contratação não encontrada' })
  @UseGuards(AuthGuard)
  @Patch('contracted/:contractedServiceId/reject')
  async rejectContract(
    @Param('contractedServiceId') contractedServiceId: string,
    @Req() req: Request,
  ) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    const author = await this.authService.describeMe(token);

    return await this.serviceService.rejectContract(
      contractedServiceId,
      author.id,
    );
  }

  @ApiOperation({
    summary: 'Deletar serviço anunciado',
    description: 'Remove um serviço anunciado',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID do serviço anunciado',
  })
  @ApiResponse({ status: 200, description: 'Serviço deletado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  @UseGuards(AuthGuard)
  @Delete('provided/:id')
  async deleteProvidedService(@Param('id') id: string, @Req() req: Request) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    const author = await this.authService.describeMe(token);

    await this.serviceService.deleteProvidedService(id, author.id);
  }

  @ApiOperation({
    summary: 'Obter serviço anunciado por ID',
    description: 'Retorna detalhes de um serviço anunciado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do serviço anunciado',
  })
  @ApiResponse({ status: 200, description: 'Dados do serviço' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  @Get('provided/:id')
  async getProvidedServiceById(@Param('id') id: string) {
    return await this.serviceService.getProviderServiceById(id);
  }

  @ApiOperation({
    summary: 'Obter disponibilidade do serviço',
    description: 'Retorna horários disponíveis para agendamento',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do serviço anunciado',
  })
  @ApiResponse({ status: 200, description: 'Disponibilidade do serviço' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  @Get('provided/:id/availability')
  async getAvailability(@Param('id') id: string) {
    return await this.serviceService.getAvailability(id);
  }
}
