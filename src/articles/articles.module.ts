import { Module } from '@nestjs/common';
import { ArticleController } from './articles.controller';
import { ArticleService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule { }