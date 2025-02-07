import { Module } from '@nestjs/common';
import { ArticleModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }

  ]
})
export class AppModule { }
