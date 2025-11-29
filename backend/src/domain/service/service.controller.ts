import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateServiceDto } from './dtos/create-service.dto';
import ServiceService from './service.service';
import { ProvideServiceDto } from './dtos/provide-service.dto';
import { GetAllProvidedQueryDto } from './dtos/get-all-provided-services.dto';
import { ContractServiceBodyDto } from './dtos/contract-service.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetAllContractedQueryDto } from './dtos/get-all-contracted-services.dto';

@Controller('service')
export default class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

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

  @Get('contracted/by-contractorId/:contractorId')
  async getAllContracted(
    @Param('contractorId') contractorId: string,
    @Query() query: GetAllContractedQueryDto,
  ) {
    const { page = 1, limit = 10 } = query;
    return this.serviceService.getAllContracted({
      page,
      limit,
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
