import {z, ZodEffects, ZodType} from "zod";

const directAllowedDomains = ["gmail.com", "pens.ac.id"];
const allowedStudentDepartments = ["it", "ce", "be"];
const studentDomainSuffix = ".student.pens.ac.id";

const emailSchema = z.string()
    .min(1, "Email address is required")
    .email("Invalid email address")
    .refine((email) => {
        const domain = email.split("@")[1];

        if (!domain) {
            return false;
        }

        if (directAllowedDomains.includes(domain)) {
            return true;
        }

        if (domain.endsWith(studentDomainSuffix)) {
            const departmentPart = domain.substring(0, domain.length - studentDomainSuffix.length);

            return allowedStudentDepartments.includes(departmentPart);
        }

        return false;
    }, {
        message: "Email must be part of EEPIS domain"
    });

const resetPasswordSchema = z.object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters long"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
});

export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        id: z.string().min(1, "NRP or NIDN is required"),
        email: emailSchema,
        password: z.string().min(8).max(100),
        name: z.string().min(1).max(100),
    });

    static readonly LOGIN: ZodType = z.object({
        email: emailSchema,
        password: z.string().min(8).max(100),
    });

    static readonly RESET: ZodType = resetPasswordSchema;

    static readonly REFRESH: ZodType = z.object({
        refreshToken: z.string().min(1),
    });
}