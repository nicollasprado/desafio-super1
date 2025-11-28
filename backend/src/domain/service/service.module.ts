import { Module } from '@nestjs/common';
import ServiceController from './service.controller';
import ServiceService from './service.service';
import UserModule from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
