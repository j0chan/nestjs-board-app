import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article } from './article.entity';
import { ArticleStatus } from './article-status.enum';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name)

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>
    ) { }

    // CREATE
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, logginedUser: User): Promise<Article> {
        this.logger.verbose(`User: ${logginedUser.username} is creating a new Article with title: ${createArticleRequestDto.title}`)

        const { title, contents } = createArticleRequestDto
        if (!title || !contents) {
            this.logger.error(`Title and contents must be provided`)
            throw new BadRequestException('Title and Contents must be provided')
        }
        const newArticle: Article = this.articleRepository.create({
            author: logginedUser.username,
            title,
            contents,
            status: ArticleStatus.PUBLIC,
            user: logginedUser,
        })
        const createdArticle = await this.articleRepository.save(newArticle)

        this.logger.verbose(`Article title with ${createdArticle.title} created Successfully`)
        return createdArticle;
    }

    // READ - all
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose(`Retrieving all Articles`)

        const foundArticle = await this.articleRepository.find()

        this.logger.verbose(`Retrieved all Articles list Successfully`)
        return foundArticle
    }

    // READ - by Loggined User
    async getMyAllArticles(logginedUser: User): Promise<Article[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all Articles`)

        const foundArticle = await this.articleRepository.createQueryBuilder('Article')
            .leftJoinAndSelect('Article.user', 'user')
            .where('Article.userId = :userId', { userId: logginedUser.id })
            .getMany()

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`)
        return foundArticle
    }

    // READ - by id
    async getArticleDetailById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving a Article by id: ${id}`)

        const foundArticle = await this.articleRepository.createQueryBuilder('Article')
            .leftJoinAndSelect('Article.user', 'user')
            .where('Article.id = :id', { id })
            .getOne()

        if (!foundArticle) {
            throw new NotFoundException(`Article with ID:${id} not found`)
        }

        this.logger.verbose(`Retrieved a Article by id: ${id} details Successfully`)
        return foundArticle
    }

    // READ - by keyword
    async getArticlesByKeyword(author: string): Promise<Article[]> {
        this.logger.verbose(`Retrieving Articles by author: ${author}`)

        if (!author) {
            throw new BadRequestException('Author keyword must be provided')
        }
        const foundArticles = await this.articleRepository.findBy({ author: author })
        if (foundArticles.length === 0) {
            throw new NotFoundException(`Articles with Author:${author} not found`)
        }

        this.logger.verbose(`Retrieved Articles list by id: ${author} Successfully`)
        return foundArticles
    }

    // UPDATE - by id
    async updateArticleById(id: number, updateArticleRequestDto: UpdateArticleRequestDto): Promise<Article> {
        this.logger.verbose(`Updating a Article by id: ${id} with updateArticleRequestDto`)

        const foundArticle = await this.getArticleDetailById(id)
        const { title, contents } = updateArticleRequestDto
        if (!title || !contents) {
            throw new BadRequestException('Title and Contents must be provided')
        }
        foundArticle.title = title
        foundArticle.contents = contents
        const updatedArticle = await this.articleRepository.save(foundArticle)

        this.logger.verbose(`Updated a Article by id: ${id} Successfully`)
        return updatedArticle
    }

    // UPDATE - by status <ADMIN>
    async updateArticleStatusById(id: number, status: ArticleStatus): Promise<void> {
        this.logger.verbose(`ADMIN is Updating a Article by id: ${id} with status: ${status}`)

        const result = await this.articleRepository.update(id, { status })
        if (result.affected === 0) {
            throw new NotFoundException(`Article with ID ${id} not found`)
        }

        this.logger.verbose(`ADMIN has Updated a Article status to ${status} Successfully`)
    }

    // DELETE - by id
    async deleteArticleById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser} is Deleting a Article by id: ${id}`)

        const foundArticle = await this.getArticleDetailById(id)
        if (foundArticle.user.id !== logginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this Article')
        }
        await this.articleRepository.delete(foundArticle)

        this.logger.verbose(`Deleted a Article by id: ${id} Successfully`)
    }
}
