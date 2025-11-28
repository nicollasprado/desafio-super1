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
import UserService from '../user/user.service';

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly userService: UserService,
  ) {}

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
    await this.userService.findById(userId);

    const fileUrl = await this.uploadService.uploadAvatar(file, userId);

    await this.userService.updateAvatar(userId, fileUrl);
    return { url: fileUrl };
  }
}
