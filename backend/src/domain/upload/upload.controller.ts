import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { TFileDTO } from './dtos/upload.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: TFileDTO): Promise<{ url: string }> {
    const fileUrl = await this.uploadService.upload(file);
    return { url: fileUrl };
  }

  @Post('user-avatar/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: TFileDTO,
  ): Promise<{ url: string }> {
    const fileUrl = await this.uploadService.uploadAvatar(file, userId);
    return { url: fileUrl };
  }

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
