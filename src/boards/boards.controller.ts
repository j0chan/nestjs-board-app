import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService : BoardsService){}

    // 주입된 인스턴스 사용
    @Get('hello')
    async getHello(): Promise<string> {
        return this.boardsService.hello()
    }

}
