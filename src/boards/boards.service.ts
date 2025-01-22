import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    // 테스트 용도로 boards배열을 임시 DB로 사용
    private boards: Board[] = []


    // 게시글 조회 기능
    getAllBoards(): Board[] {
        const foundBoard = this.boards

        if(foundBoard.length === 0 ) {
            throw new NotFoundException('Board not found')
        }

        return this.boards
    }
    
    // 특정 게시글 조회 기능
    getBoardDetailById(id: number): Board {
        const foundBoard = this.boards.find((board) => board.id == id)

        if(!foundBoard) {
            throw new NotFoundException(`Board with ID:${id} not found`)
        }
        
        return foundBoard
    }

    // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    getBoardsByKeyword(author: string): Board[] {
        const foundBoards =  this.boards.filter((board) => board.author === author)

        if(foundBoards.length === 0) {
            throw new NotFoundException(`Boards with Author:${author} not found`)
        }

        return foundBoards
    }

    // 게시글 작성 기능
    createBoard(createBoardDto: CreateBoardDto) {
        const {author, title, contents} = createBoardDto

        const board: Board = {
            id: this.boards.length + 1, // 임시 auto increament 기능
            author,
            title,
            contents,
            status: BoardStatus.PUBLIC,
        }

        // DB에 만들어진 board 객체를 push
        const savedBoard = this.boards.push(board)

        return savedBoard;
    }

    // 특정 번호의 게시글 수정
    updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Board {
        // 특정 보드 가져오는 메서드 재활용
        const foundBoard = this.getBoardDetailById(id)

        const {title, contents} = updateBoardDto

        foundBoard.title = title
        foundBoard.contents = contents

        return foundBoard
    }

    // 특정 번호의 게시글 일부 수정
    updateBoardStatusById(id: number, status: BoardStatus): Board {
        const foundBoard = this.getBoardDetailById(id)

        if(foundBoard.status === status) {
            throw new BadRequestException(`Status is already ${status}`)
        }

        foundBoard.status = status
        
        return foundBoard
    }

    // 게시글 삭제 기능
    deleteBoardById(id: number): void {
        const startLength = this.boards.length
        const endLength = this.boards.filter((board) => board.id !== Number(id)).length
    
        if (startLength === endLength) {
            throw new NotFoundException(`Board with ID:${id} not found`)
        }

        this.boards = this.boards.filter((board) => board.id !== Number(id))
    }
}
