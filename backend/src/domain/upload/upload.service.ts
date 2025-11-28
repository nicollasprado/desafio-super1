import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TFileDTO } from './dtos/upload.dto';
import supabase from 'src/infra/lib/supabase';
import { ConfigService } from '@nestjs/config';
import UserService from '../user/user.service';
import ServiceService from '../service/service.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly serviceService: ServiceService,
  ) {}

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
    await this.userService.findById(userId);

    const fileExtension = file.originalname.split('.')[1];
    const fileUrl = await this.upload(file, `avatar.${fileExtension}`, userId);

    const finalFileUrl = `${fileUrl}?width=50&height=50`;

    await this.userService.updateAvatar(userId, finalFileUrl);

    return finalFileUrl;
  }

  async uploadProviderServiceImage(
    file: TFileDTO,
    providerServiceId: string,
  ): Promise<string> {
    const providerService =
      await this.serviceService.getProviderServiceById(providerServiceId);

    const fileUrl = await this.upload(
      file,
      undefined,
      `${providerService.providerId}/providedServices/${providerServiceId}`,
    );

    await this.serviceService.addProvidedServiceImage(
      providerServiceId,
      fileUrl,
    );

    return fileUrl;
  }
}
