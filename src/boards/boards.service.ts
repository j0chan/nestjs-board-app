import { Injectable } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';

@Injectable()
export class BoardsService {
    // 테스트 용도로 boards배열을 임시 DB로 사용
    private boards: Board[] = []

    // 게시글 조회 기능
    getAllBoards(): Board[] {
        return this.boards
    }
    
    // 특정 게시글 조회 기능
    getBoardDetailById(id: number): Board {
        return this.boards.find((board) => board.id == id)
    }

    // 게시글 작성 기능
    createBoard(author: string, title: string, contents: string) {
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
}
