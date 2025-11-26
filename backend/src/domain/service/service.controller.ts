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
import { ContractServiceDto } from './dtos/contract-service.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('service')
export default class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() data: CreateServiceDto) {
    return await this.serviceService.create(data);
  }

  @Get()
  async getAll() {
    return await this.serviceService.getAll();
  }

  @Post('provide')
  async provide(@Body() data: ProvideServiceDto) {
    return await this.serviceService.provide(data);
  }

  @Get('provided')
  async getAllProvided(@Query() query: GetAllProvidedQueryDto) {
    const { page = 1, limit = 10, serviceId, search } = query;
    return this.serviceService.getAllProvided({
      page,
      limit,
      serviceId,
      search,
    });
  }

  @Post('contract')
  async contract(@Body() data: ContractServiceDto) {
    return await this.serviceService.contract(data);
  }

  @Delete('provided/:id')
  async deleteProvidedService(@Param('id') id: string) {
    await this.serviceService.deleteProvidedService(id);
  }

  @Get('provided/:id')
  async getProvidedServiceById(@Param('id') id: string) {
    return await this.serviceService.getProviderServiceById(id);
  }
}
