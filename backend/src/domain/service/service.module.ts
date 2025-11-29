import { Module } from '@nestjs/common';
import ServiceController from './service.controller';
import ServiceService from './service.service';
import UserModule from '../user/user.module';
import { SearchModule } from '../search/search.module';
import AuthModule from '../auth/auth.module';

@Module({
  imports: [UserModule, SearchModule, AuthModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
