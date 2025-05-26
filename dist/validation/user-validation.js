"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const allowedDomains = ["gmail.com", "pens.ac.id"];
const emailSchema = zod_1.z.string()
    .min(1, "Email address is required")
    .email("Invalid email address")
    .refine((email) => {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
}, {
    message: "Email must be part of EEPIS domain"
});
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    email: emailSchema,
    password: zod_1.z.string().min(1).max(100),
    name: zod_1.z.string().min(1).max(100),
});
