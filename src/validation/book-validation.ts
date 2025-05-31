import {ZodType, z} from "zod";

export class BookValidation {
    static readonly CREATE: ZodType = z.object({
        isbn: z.string().min(1, "ISBN must not be empty"),
        title: z.string().min(1, "Title must not be empty"),
        description: z.string().min(1, "Description must not be empty"),
        cover: z.string().optional(),
        year: z.number().nonnegative("Invalid year value"),
        pages: z.number().nonnegative("Invalid number of pages"),
        language: z.string().min(1, "Language must not be empty"),
        category: z.string().min(1, "Category must not be empty").optional(),
        author: z.string().min(1, "Author must not be empty"),
        publisher: z.string().min(1, "Publisher must not be empty").optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1, "Title must not be empty").optional(),
        description: z.string().min(1, "Description must not be empty").optional(),
        cover: z.string().optional(),
        year: z.number().nonnegative("Invalid year value").optional(),
        pages: z.number().nonnegative("Invalid number of pages").optional(),
        language: z.string().min(1, "Language must not be empty").optional(),
        category: z.string().min(1, "Category must not be empty").optional(),
        author: z.string().min(1, "Author must not be empty").optional(),
        isAvailable: z.boolean().optional(),
    });
}