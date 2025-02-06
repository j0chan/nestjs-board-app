import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardSearchResponseDto } from './dto/board-search-response.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardStatus } from './boards-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/users-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/users.entity';

@Controller('api/boards')
@UseGuards(AuthGuard(), RolesGuard)
export class BoardsController {
    private readonly logger = new Logger(BoardsController.name)
    constructor(private boardsService: BoardsService) { }

    // 게시글 작성 기능
    @Post('/')
    async createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() logginedUser: User): Promise<BoardResponseDto> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new board with title: ${createBoardDto.title}`)

        const boardResponseDto = await this.boardsService.createBoard(createBoardDto, logginedUser)

        this.logger.verbose(`Board title with ${boardResponseDto.title} created Successfully`)
        return boardResponseDto
    }

    // 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER)
    async getAllBoards(): Promise<BoardResponseDto[]> {
        this.logger.verbose(`Try to Retrieving all Boards`)

        const boards: Board[] = await this.boardsService.getAllBoards()
        const boardsResponseDto = boards.map(board => new BoardResponseDto(board))
        
        this.logger.verbose(`Retrieved all Boards list Successfully`)
        return boardsResponseDto
    }

    // 로그인된 유저의 게시글 조회 기능
    @Get('/myboards')
    async getMyAllBoards(@GetUser() logginedUser: User): Promise<BoardResponseDto[]> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Boards`)

        const boards: Board[] = await this.boardsService.getMyAllBoards(logginedUser)
        const boardsResponseDto = boards.map(board => new BoardResponseDto(board))
        
        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Boards list Successfully`)
        return boardsResponseDto
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    async getBoardDetailById(@Param('id') id: number): Promise<BoardSearchResponseDto> {
        this.logger.verbose(`Try to Retrieving a Board by id: ${id}`)

        const boardResponseDto = new BoardSearchResponseDto(await this.boardsService.getBoardDetailById(id))
        
        this.logger.verbose(`Retrieved a Board by id: ${id} details Successfully`)
        return boardResponseDto
    }

    // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getBoardsByKeyword(@Query('author') author: string): Promise<BoardSearchResponseDto[]> {
        this.logger.verbose(`Try to Retrieving Boards by author: ${author}`)

        const boards: Board[] = await this.boardsService.getBoardsByKeyword(author)
        const boardsSearchResponseDto = boards.map(board => new BoardSearchResponseDto(board))
        
        this.logger.verbose(`Retrieved Boards list by id: ${author} Successfully`)
        return boardsSearchResponseDto
    }

    //특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById(
        @Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto): Promise<Board> {
        this.logger.verbose(`Try to Updating a Board by id: ${id} with updateBoardDto`)

        const boardResponseDto = await this.boardsService.updateBoardById(id, updateBoardDto)
        
        this.logger.verbose(`Updated a Board by id: ${id} Successfully`)
        return boardResponseDto
    }

    // 특정 번호의 게시글 일부 수정 [ADMIN 가능]
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateBoardStatusById(
        @Param('id') id: number, @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<void> {
        this.logger.verbose(`Try to ADMIN is Updating a Board by id: ${id} with status: ${status}`)

        this.boardsService.updateBoardStatusById(id, status)

        this.logger.verbose(`ADMIN has Updated a Board status to ${status} Successfully`)
    }

    // 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteBoardById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`Try to User: ${logginedUser} is Deleting a Board by id: ${id}`)

        this.boardsService.deleteBoardById(id, logginedUser)
        
        this.logger.verbose(`Deleted a Board by id: ${id} Successfully`)
    }
}
