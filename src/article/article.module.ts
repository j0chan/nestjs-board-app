import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Article } from './article.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule { }