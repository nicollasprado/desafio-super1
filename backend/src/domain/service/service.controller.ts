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

@Controller('service')
export default class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateServiceDto) {
    return await this.serviceService.create(data);
  }

  @Get()
  async getAll() {
    return await this.serviceService.getAll();
  }

  @UseGuards(AuthGuard)
  @Post('provide')
  async provide(@Body() data: ProvideServiceDto) {
    return await this.serviceService.provide(data);
  }

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

  @UseGuards(AuthGuard)
  @Post('provided/variant/:variantId/contract')
  async contract(
    @Param('variantId') variantId: string,
    @Body() data: ContractServiceBodyDto,
  ) {
    return await this.serviceService.contract({ ...data, variantId });
  }

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

  @UseGuards(AuthGuard)
  @Delete('provided/:id')
  async deleteProvidedService(@Param('id') id: string) {
    await this.serviceService.deleteProvidedService(id);
  }

  @Get('provided/:id')
  async getProvidedServiceById(@Param('id') id: string) {
    return await this.serviceService.getProviderServiceById(id);
  }

  @Get('provided/:id/availability')
  async getAvailability(@Param('id') id: string) {
    return await this.serviceService.getAvailability(id);
  }
}
