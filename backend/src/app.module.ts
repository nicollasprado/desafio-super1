import { Module } from '@nestjs/common';
import UserModule from './domain/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceModule } from './domain/service/service.module';
import { UploadModule } from './domain/upload/upload.module';
import { SearchModule } from './domain/search/search.module';
import AuthModule from './domain/auth/auth.module';
import * as Joi from 'joi';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_KEY: Joi.string().required(),
        SUPABASE_BUCKET: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
      }),
    }),
    UserModule,
    AuthModule,
    ServiceModule,
    UploadModule,
    SearchModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        store: redisStore,
        url: ConfigService.get<string>('REDIS_URL'),
        ttl: 300, // 5min
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
