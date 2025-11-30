import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { TFileDTO } from './dtos/upload.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary: 'Upload de arquivo',
    description: 'Faz upload de um arquivo genérico',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Upload realizado com sucesso',
    schema: {
      example: {
        url: 'https://storage.example.com/files/abc123.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: TFileDTO): Promise<{ url: string }> {
    const fileUrl = await this.uploadService.upload(file);
    return { url: fileUrl };
  }

  @ApiOperation({
    summary: 'Upload de avatar de usuário',
    description: 'Faz upload do avatar do usuário',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar atualizado com sucesso',
    schema: {
      example: {
        url: 'https://storage.example.com/avatars/user123.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @Post('user-avatar/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: TFileDTO,
  ): Promise<{ url: string }> {
    const fileUrl = await this.uploadService.uploadAvatar(file, userId);
    return { url: fileUrl };
  }

  @ApiOperation({
    summary: 'Upload de imagem do serviço',
    description: 'Adiciona imagem ao serviço anunciado',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'providerServiceId',
    description: 'ID do serviço anunciado',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagem adicionada com sucesso',
    schema: {
      example: {
        url: 'https://storage.example.com/services/service123.jpg',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  @Post('provided-service-image/:providerServiceId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadServiceImage(
    @Param('providerServiceId') providerServiceId: string,
    @UploadedFile() file: TFileDTO,
  ): Promise<{ url: string }> {
    const fileUrl = await this.uploadService.uploadProviderServiceImage(
      file,
      providerServiceId,
    );

    return { url: fileUrl };
  }
}
