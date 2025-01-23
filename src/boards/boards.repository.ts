import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createPool, Pool } from "mysql2/promise";
import { databaseConfig } from "src/configs/database.config";
import { Board } from "./boards.entity";

@Injectable()
// 쿼리 실행을 담당하는 Repository 계층
export class BoardsRepository {
    private connectionPool: Pool

    constructor() {
        this.connectionPool = createPool(databaseConfig)
        this.connectionPool.getConnection()
            .then(() => console.log('DB Connected'))
            .catch(err => console.error('DB Connection failed', err))
    }

    // 게시글 조회 관련 데이터 액세스
    async findAll(): Promise<Board[]> {
        const selectQuery = `SELECT * FROM board`
        try {
            const[result] = await this.connectionPool.query(selectQuery)
            return result as Board[]
        } catch(err) {
            throw new InternalServerErrorException('Database query failed', err)
        }
    }

}