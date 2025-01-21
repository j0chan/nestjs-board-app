import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BoardsService } from './boards/boards.service';

@Module({
  imports: [BoardsModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}
