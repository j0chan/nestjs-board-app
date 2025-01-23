import { BlogStatus } from "./blogs-status.enum"

export class Blog {
    id: number
    author: string
    title: string
    contents: string
    status: BlogStatus
}