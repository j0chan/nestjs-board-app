import { Injectable } from '@nestjs/common';
import { Board } from './boards.entity';

@Injectable()
export class BoardsService {
    // 테스트 용도로 boards배열을 임시 DB로 사용
    private boards: Board[] = []

    // 게시글 조회 기능
    getAllBoards(): Board[] {
        return this.boards
    }
}
