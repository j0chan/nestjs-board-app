import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogsModule } from './blog/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    BoardsModule, 
    BlogsModule,
  ],
})
export class AppModule {}
