import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { SearchArticleResponseDto } from './dto/search-article-response.dto';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from './pipes/article-status-validation.pipe';
import { ArticleStatus } from './article-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('api/articles')
@UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name)

    constructor(private articleService: ArticleService) { }

    // CREATE
    @Post('/')
    async createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto, @GetUser() logginedUser: User): Promise<ArticleResponseDto> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new Article with title: ${createArticleRequestDto.title}`)

        const articleResponseDto = await this.articleService.createArticle(createArticleRequestDto, logginedUser)

        this.logger.verbose(`Article title with ${articleResponseDto.title} created Successfully`)
        return articleResponseDto
    }

    // READ - all
    @Get('/')
    @Roles(UserRole.USER)
    async getAllArticles(): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Try to Retrieving all Articles`)

        const articles: Article[] = await this.articleService.getAllArticles()
        const articlesResponseDto = articles.map(Article => new ArticleResponseDto(Article))

        this.logger.verbose(`Retrieved all Articles list Successfully`)
        return articlesResponseDto
    }

    // READ - by Loggined User
    @Get('/myArticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ArticleResponseDto[]> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Articles`)

        const articles: Article[] = await this.articleService.getMyAllArticles(logginedUser)
        const articlesResponseDto = articles.map(Article => new ArticleResponseDto(Article))

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`)
        return articlesResponseDto
    }

    // READ - by id
    @Get('/:id')
    async getArticleDetailById(@Param('id') id: number): Promise<SearchArticleResponseDto> {
        this.logger.verbose(`Try to Retrieving a Article by id: ${id}`)

        const articleResponseDto = new SearchArticleResponseDto(await this.articleService.getArticleDetailById(id))

        this.logger.verbose(`Retrieved a Article by id: ${id} details Successfully`)
        return articleResponseDto
    }

    // READ - by keyword
    @Get('/search/:keyword')
    async getArticlesByKeyword(@Query('author') author: string): Promise<SearchArticleResponseDto[]> {
        this.logger.verbose(`Try to Retrieving Articles by author: ${author}`)

        const articles: Article[] = await this.articleService.getArticlesByKeyword(author)
        const articlesSearchResponseDto = articles.map(Article => new SearchArticleResponseDto(Article))

        this.logger.verbose(`Retrieved Articles list by id: ${author} Successfully`)
        return articlesSearchResponseDto
    }

    // UPDATE - by id
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number, @Body() updateArticleRequestDto: UpdateArticleRequestDto): Promise<Article> {
        this.logger.verbose(`Try to Updating a Article by id: ${id} with updateArticleRequestDto`)

        const articleResponseDto = await this.articleService.updateArticleById(id, updateArticleRequestDto)

        this.logger.verbose(`Updated a Article by id: ${id} Successfully`)
        return articleResponseDto
    }

    // UPDATE - by status <ADMIN>
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id') id: number, @Body('status', ArticleStatusValidationPipe) status: ArticleStatus): Promise<void> {
        this.logger.verbose(`Try to ADMIN is Updating a Article by id: ${id} with status: ${status}`)

        this.articleService.updateArticleStatusById(id, status)

        this.logger.verbose(`ADMIN has Updated a Article status to ${status} Successfully`)
    }

    // DELETE - by id
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`Try to User: ${logginedUser} is Deleting a Article by id: ${id}`)

        this.articleService.deleteArticleById(id, logginedUser)

        this.logger.verbose(`Deleted a Article by id: ${id} Successfully`)
    }
}
