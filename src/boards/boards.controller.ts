import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards-status.enum';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('api/boards')
@UsePipes(ValidationPipe) // UsePipes 어노테이션으로 파이프를 통한 유효성 검증 활성화
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService : BoardsService){}


    // 게시글 조회 기능
    @Get('/')
    async getAllBoards(): Promise<Board[]> {
        return await this.boardsService.getAllBoards()
    }

    // // 특정 게시글 조회 기능 [endpoint 파라미터로 id 사용]
    // @Get('/:id')
    // getBoardDetailById(@Param('id') id: number): Board {
    //     return this.boardsService.getBoardDetailById(id)
    // }

    // // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    // @Get('/search/:keyword')
    // getBoardsByKeyword(@Query('author')author: string): Board[] {
    //     return this.boardsService.getBoardsByKeyword(author)
    // }

    // 게시글 작성 기능
    @Post('/')
    createBoard(@Body() createBoardDto: CreateBoardDto) {
        return this.boardsService.createBoard(createBoardDto)
    }

    // // 특정 번호의 게시글 수정
    // @Put('/:id')
    // updateBoardById(
    //     @Param('id') id: number,
    //     @Body() updateBoardDto: UpdateBoardDto): Board {
    //     return this.boardsService.updateBoardById(id, updateBoardDto)
    // }

    // // 특정 번호의 게시글 일부 수정
    // @Patch('/:id')
    // updateBoardStatusById(
    //     @Param('id') id: number,
    //     @Body('status', BoardStatusValidationPipe) status: BoardStatus): Board {
    //     return this.boardsService.updateBoardStatusById(id, status)
    // }

    // // 게시글 삭제 기능
    // @Delete('/:id')
    // deleteBoardById(@Param('id') id: number): void {
    //     this.boardsService.deleteBoardById(id)
    // }
}
