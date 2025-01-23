import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    port: +process.env.DB_PORT, //+는 문자->숫자로 바꿔줌
    database: process.env.DB_NAME,
    connectionLimit: 10,
    insecureAuth: true,
};