import {Prisma} from "../../generated/prisma";

export type CreateBookRequest = {
    isbn: string;
    title: string;
    description: string;
    cover?: string;
    year: number;
    pages: number;
    language: string;
    category: string;
    author: string;
    isAvailable: boolean;
}

export type UpdateBookRequest = {
    title?: string;
    description?: string;
    cover?: string;
    year?: number;
    pages?: number;
    language?: string;
    category?: string;
    author?: string;
    isAvailable?: boolean;
}

export type BookResponse = {
    isbn: string;
    title: string;
}

type BookWithAuthorAndCategory = Prisma.BookGetPayload<{
    include: {
        author: {
            select: { name: true }
        };
        category: {
            select: { name: true }
        };
    }
}>;

export interface PaginatedBookResponse {
    data: BookWithAuthorAndCategory[];
    pagination: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface SearchBooksOptions {
    bookId?: string;
    title?: string;
    authorId?: number;
    authorName?: string;
    categoryId?: number;
    categoryName?: string;
    page?: number;
    pageSize?: number;
}