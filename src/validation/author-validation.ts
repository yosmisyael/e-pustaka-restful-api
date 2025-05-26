import {z, ZodType} from "zod";

export class AuthorValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().min(1, "Author name must not be empty"),
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1, "Author name must not be empty"),
    });
}