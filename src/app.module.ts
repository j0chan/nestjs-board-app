import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogsModule } from './blog/blogs.module';

@Module({
  imports: [BoardsModule, BlogsModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}
