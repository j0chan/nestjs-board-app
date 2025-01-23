import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from './blogs.entity';
import { BlogStatus } from './blogs-status.enum';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
    // 테스트 용도로 blogs배열을 임시 DB로 사용
    private blogs: Blog[] = []


    // 게시글 조회 기능
    getAllBlogs(): Blog[] {
        const foundBlog = this.blogs

        if(foundBlog.length === 0 ) {
            throw new NotFoundException('Blog not found')
        }

        return this.blogs
    }
    
    // 특정 게시글 조회 기능
    getBlogDetailById(id: number): Blog {
        const foundBlog = this.blogs.find((blog) => blog.id == id)

        if(!foundBlog) {
            throw new NotFoundException(`Blog with ID:${id} not found`)
        }
        
        return foundBlog
    }

    // 특정 키워드(작성자)로 검색한 게시글 조회 기능
    getBlogsByKeyword(author: string): Blog[] {
        const foundBlogs =  this.blogs.filter((blog) => blog.author === author)

        if(foundBlogs.length === 0) {
            throw new NotFoundException(`Blogs with Author:${author} not found`)
        }

        return foundBlogs
    }

    // 게시글 작성 기능
    createBlog(createBlogDto: CreateBlogDto) {
        const {author, title, contents} = createBlogDto

        if(!author || !title || !contents) {
            throw new BadRequestException('Author, Title and Contents must be provided')
        }

        const blog: Blog = {
            id: this.blogs.length + 1, // 임시 auto increament 기능
            author,
            title,
            contents,
            status: BlogStatus.PUBLIC,
        }

        // DB에 만들어진 blog 객체를 push
        const savedBlog = this.blogs.push(blog)

        return savedBlog;
    }

    // 특정 번호의 게시글 수정
    updateBlogById(id: number, updateBlogDto: UpdateBlogDto): Blog {
        // 특정 보드 가져오는 메서드 재활용
        const foundBlog = this.getBlogDetailById(id)

        const {title, contents} = updateBlogDto
        
        if(!title || !contents) {
            throw new BadRequestException('Title and Contents must be provided')
        }

        foundBlog.title = title
        foundBlog.contents = contents

        return foundBlog
    }

    // 특정 번호의 게시글 일부 수정
    updateBlogStatusById(id: number, status: BlogStatus): Blog {
        const foundBlog = this.getBlogDetailById(id)

        if(foundBlog.status === status) {
            throw new BadRequestException(`Status is already ${status}`)
        }

        foundBlog.status = status
        
        return foundBlog
    }

    // 게시글 삭제 기능
    deleteBlogById(id: number): void {
        const startLength = this.blogs.length
        const endLength = this.blogs.filter((blog) => blog.id !== Number(id)).length
    
        if (startLength === endLength) {
            throw new NotFoundException(`Blog with ID:${id} not found`)
        }

        this.blogs = this.blogs.filter((blog) => blog.id !== Number(id))
    }
}
