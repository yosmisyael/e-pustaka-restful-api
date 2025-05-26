import {z, ZodType} from "zod";

const borrowingSchema = z.object({
    userId: z.string({
        required_error: "User ID is required",
    }).min(1, "User ID must not be empty"),
    bookId: z.string({
        required_error: "Book ID is required",
    }).min(1, "Book ID must not be empty"),
    borrowDate: z.coerce.date({
        required_error: "Borrow date must not be empty",
        invalid_type_error: "Borrow date must be a valid date",
    }),
    returnDate: z.coerce.date({
        required_error: "Return date must not be empty",
        invalid_type_error: "Return date must be a valid date",
    }),
}).superRefine((data, ctx) => {
    // Rule 1: returnDate must be strictly greater than borrowDate.
    if (data.returnDate.getTime() <= data.borrowDate.getTime()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Return date must be after the borrow date.",
            path: ["returnDate"],
        });
        return;
    }

    // Rule 2: Borrow period must be at least 1 full day (24 hours).
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const differenceInMilliseconds = data.returnDate.getTime() - data.borrowDate.getTime();

    if (differenceInMilliseconds < oneDayInMilliseconds) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The borrowing period must be at least 1 full day (24 hours).",
            path: ["returnDate"],
        });
    }
});

export class BorrowingValidation {
    static readonly CREATE: ZodType = borrowingSchema;
}