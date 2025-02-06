import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/auth/users.entity';

@Injectable()
export class BoardsService {
    private readonly logger = new Logger(BoardsService.name)

    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>
    ) { }

    // 게시글 작성 기능
    async createBoard(createBoardDto: CreateBoardDto, logginedUser: User): Promise<Board> {
        this.logger.verbose(`User: ${logginedUser.username} is creating a new board with title: ${createBoardDto.title}`)

        const { title, contents } = createBoardDto
        if (!title || !contents) {
            this.logger.error(`Title and contents must be provided`)
            throw new BadRequestException('Title and Contents must be provided')
        }
        const newBoard: Board = this.boardsRepository.create({
            author: logginedUser.username,
            title,
            contents,
            status: BoardStatus.PUBLIC,
            user: logginedUser,
        })
        const createdBoard = await this.boardsRepository.save(newBoard)

        this.logger.verbose(`Board title with ${createdBoard.title} created Successfully`)
        return createdBoard;
    }

    // 게시글 조회 기능
    async getAllBoards(): Promise<Board[]> {
        this.logger.verbose(`Retrieving all Boards`)

        const foundBoard = await this.boardsRepository.find()

        this.logger.verbose(`Retrieved all Boards list Successfully`)
        return foundBoard
    }

    // 로그인된 유저의 게시글 조회 기능
    async getMyAllBoards(logginedUser: User): Promise<Board[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Boards`)

        const foundBoard = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .where('board.userId = :userId', { userId: logginedUser.id })
            .getMany()

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Boards list Successfully`)
        return foundBoard
    }

    // 특정 게시글 조회 기능
    async getBoardDetailById(id: number): Promise<Board> {
        this.logger.verbose(`Retrieving a Board by id: ${id}`)

        const foundBoard = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .where('board.id = :id', { id })
            .getOne()

        if (!foundBoard) {
            throw new NotFoundException(`Board with ID:${id} not found`)
        }

        this.logger.verbose(`Retrieved a Board by id: ${id} details Successfully`)
        return foundBoard
    }

    // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    async getBoardsByKeyword(author: string): Promise<Board[]> {
        this.logger.verbose(`Retrieving Boards by author: ${author}`)

        if (!author) {
            throw new BadRequestException('Author keyword must be provided')
        }
        const foundBoards = await this.boardsRepository.findBy({ author: author })
        if (foundBoards.length === 0) {
            throw new NotFoundException(`Boards with Author:${author} not found`)
        }
        
        this.logger.verbose(`Retrieved Boards list by id: ${author} Successfully`)
        return foundBoards
    }

    // 특정 번호의 게시글 수정
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
        this.logger.verbose(`Updating a Board by id: ${id} with updateBoardDto`)

        const foundBoard = await this.getBoardDetailById(id)
        const { title, contents } = updateBoardDto
        if (!title || !contents) {
            throw new BadRequestException('Title and Contents must be provided')
        }
        foundBoard.title = title
        foundBoard.contents = contents
        const updatedBoard = await this.boardsRepository.save(foundBoard)
        
        this.logger.verbose(`Updated a Board by id: ${id} Successfully`)
        return updatedBoard
    }

    // 특정 번호의 게시글 일부 수정
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {
        this.logger.verbose(`ADMIN is Updating a Board by id: ${id} with status: ${status}`)

        const result = await this.boardsRepository.update(id, { status })
        if (result.affected === 0) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }
        
        this.logger.verbose(`ADMIN has Updated a Board status to ${status} Successfully`)
    }

    // 게시글 삭제 기능
    async deleteBoardById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser} is Deleting a Board by id: ${id}`)

        const foundBoard = await this.getBoardDetailById(id)
        if (foundBoard.user.id !== logginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this board')
        }
        await this.boardsRepository.delete(foundBoard)
        
        this.logger.verbose(`Deleted a Board by id: ${id} Successfully`)
    }
}
