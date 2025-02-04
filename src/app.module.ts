import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogsModule } from './blog/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    BoardsModule,
    BlogsModule, AuthModule,
  ],
})
export class AppModule { }
