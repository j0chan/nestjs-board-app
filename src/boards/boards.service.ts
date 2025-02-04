import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    // Repository 계층 DI
    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>
    ) { }

    // 게시글 조회 기능
    async getAllBoards(): Promise<Board[]> {
        const foundBoard = await this.boardsRepository.find()
        return foundBoard
    }

    // 특정 게시글 조회 기능
    async getBoardDetailById(id: number): Promise<Board> {
        const foundBoard = await this.boardsRepository.findOneBy({ id: id })
        if (!foundBoard) {
            throw new NotFoundException(`Board with ID:${id} not found`)
        }
        return foundBoard
    }

    // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    async getBoardsByKeyword(author: string): Promise<Board[]> {
        if (!author) {
            throw new BadRequestException('Author keyword must be provided')
        }
        const foundBoards = await this.boardsRepository.findBy({ author: author })
        if (foundBoards.length === 0) {
            throw new NotFoundException(`Boards with Author:${author} not found`)
        }
        return foundBoards
    }

    // 게시글 작성 기능
    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const { author, title, contents } = createBoardDto
        if (!author || !title || !contents) {
            throw new BadRequestException('Author, Title and Contents must be provided')
        }
        const newBoard: Board = {
            id: 0, //임시 초기화
            author, // author: createBoardDto.author
            title,
            contents,
            status: BoardStatus.PUBLIC,
        }
        const createdBoard = await this.boardsRepository.save(newBoard)
        return createdBoard;
    }

    // 특정 번호의 게시글 수정
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
        const foundBoard = await this.getBoardDetailById(id)
        const { title, contents } = updateBoardDto
        if (!title || !contents) {
            throw new BadRequestException('Title and Contents must be provided')
        }
        foundBoard.title = title
        foundBoard.contents = contents
        const updatedBoard = await this.boardsRepository.save(foundBoard)
        return updatedBoard
    }

    // 특정 번호의 게시글 일부 수정
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {
        const result = await this.boardsRepository.update(id, { status })
        if (result.affected === 0) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }
    }

    // 게시글 삭제 기능
    async deleteBoardById(id: number): Promise<void> {
        const foundBoard = await this.getBoardDetailById(id)
        await this.boardsRepository.delete(foundBoard)
    }
}
