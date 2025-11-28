import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import UserModule from '../user/user.module';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [UserModule, ServiceModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
