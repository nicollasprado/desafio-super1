import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TFileDTO } from './dtos/upload.dto';
import supabase from 'src/infra/lib/supabase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async upload(
    file: TFileDTO,
    fileName?: string,
    folder?: string,
  ): Promise<string> {
    const bucketName =
      (this.configService.get('SUPABASE_BUCKET') as string) || 'marketplace';

    const finalFileName = fileName || `${Date.now()}-${file.originalname}`;
    const finalFolder = folder || 'public';

    const data = await supabase.storage
      .from(bucketName)
      .upload(`${finalFolder}/${finalFileName}`, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (data.error) {
      throw new InternalServerErrorException();
    }

    const filePath = data.data.path;

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async uploadAvatar(file: TFileDTO, userId: string): Promise<string> {
    const fileExtension = file.originalname.split('.')[1];
    const fileUrl = await this.upload(file, `avatar.${fileExtension}`, userId);

    const finalFileUrl = `${fileUrl}?width=50&height=50`;

    return finalFileUrl;
  }
}
