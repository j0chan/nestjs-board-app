import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from './blogs.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogStatus } from './blogs-status.enum';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogStatusValidationPipe } from './pipes/blog-status-validation.pipe';

@Controller('api/blog')
@UsePipes(ValidationPipe) // UsePipes 어노테이션으로 파이프를 통한 유효성 검증 활성화
export class BlogsController {
    // 생성자 주입
    constructor(private blogsService : BlogsService){}


    // 게시글 조회 기능
    @Get('/')
    getAllBlogs(): Blog[] {
        return this.blogsService.getAllBlogs()
    }

    // 특정 게시글 조회 기능 [endpoint 파라미터로 id 사용]
    @Get('/:id')
    getBlogDetailById(@Param('id') id: number): Blog {
        return this.blogsService.getBlogDetailById(id)
    }

    // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    getBlogsByKeyword(@Query('author')author: string): Blog[] {
        return this.blogsService.getBlogsByKeyword(author)
    }

    // 게시글 작성 기능
    @Post('/')
    createBlog(@Body() createBlogDto: CreateBlogDto) {
        return this.blogsService.createBlog(createBlogDto)
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    updateBlogById(
        @Param('id') id: number,
        @Body() updateBlogDto: UpdateBlogDto): Blog {
        return this.blogsService.updateBlogById(id, updateBlogDto)
    }

    // 특정 번호의 게시글 일부 수정
    @Patch('/:id')
    updateBlogStatusById(
        @Param('id') id: number,
        @Body('status', BlogStatusValidationPipe) status: BlogStatus): Blog {
        return this.blogsService.updateBlogStatusById(id, status)
    }

    // 게시글 삭제 기능
    @Delete('/:id')
    deleteBlogById(@Param('id') id: number): void {
        this.blogsService.deleteBlogById(id)
    }
}
