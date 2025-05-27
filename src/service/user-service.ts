import {
    LoginUserRequest,
    RegisterUserRequest, ResetPasswordRequest,
    TokenPayload,
    toUserResponse,
    UserInfo,
    UserResponse
} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {db} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {Prisma, roles} from '../../generated/prisma'
import UserCreateInput = Prisma.UserCreateInput;
import JwtService from "./jwt-service";

export class UserService {
    static async register(req: RegisterUserRequest): Promise<UserResponse> {
        const request: RegisterUserRequest = Validation.validate(UserValidation.REGISTER, req);

        const userStatus = this.getUserStatus(request.email);

        if (!userStatus) {
            throw new ResponseError(400, "Invalid email address");
        }

        request.role = userStatus;

        const isEmailExist = await this.verifyUserExist(request.email);

        if (isEmailExist) {
            throw new ResponseError(400, "Email already used");
        }

        request.password = await bcrypt.hash(request.password, 10);

        const user = await db.user.create({
            data: request as UserCreateInput,
        });

        return toUserResponse(user);
    }

    static async login(req: LoginUserRequest): Promise<UserResponse> {
        const loginRequest: LoginUserRequest = Validation.validate(UserValidation.LOGIN, req);

        const user = await db.user.findFirst({
            where: {
                email: loginRequest.email,
            },
        });

        if (!user) {
            throw new ResponseError(400, "Email or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ResponseError(400, "Email or password is wrong");
        }

        const token: TokenPayload = JwtService.generateToken({
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await db.user.update({
            where: {
                email: user.email,
            },
            data: {
                token: token.refreshToken,
            },
        });

        return token;
    }

    static async reset(user: UserInfo, req: ResetPasswordRequest): Promise<void> {
        const request: ResetPasswordRequest = Validation.validate(UserValidation.RESET, req);

        const userRecord = await db.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (!userRecord) {
            throw new ResponseError(404, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(request.currentPassword, userRecord.password);

        if (!isPasswordValid) {
            throw new ResponseError(400, "Password does not match");
        }

        const hashedPassword = await bcrypt.hash(request.newPassword, 10);

        await db.user.update({
            where: {
                id: userRecord.id,
            },
            data: {
                password: hashedPassword,
                token: null,
            }
        });
    }

    static async logout(user: UserInfo): Promise<void> {
        const isExist = await this.verifyUserExist(user.email);

        if (!isExist) {
            throw new ResponseError(400, "User not found");
        }

        await db.user.update({
            where: {
                email: user.email,
            },
            data: {
                token: null,
            },
        });
    }

    static async verifyUserExist(email: string): Promise<boolean> {
        const countRecord = await db.user.count({
            where: {
                email: email,
            },
        });

        return countRecord > 0;
    }

    static getUserStatus(email: string): roles | null {
        const allowedStudentDepartments = ["it", "eb", "ce"];
        const studentDomainSuffix = ".student.pens.ac.id";

        const parts = email.split("@");

        if (parts.length < 2) {
            return null;
        }

        const domain = parts[1];

        const studentDomainPattern = new RegExp(`^(${allowedStudentDepartments.join('|')})\\${studentDomainSuffix}$`);

        if (studentDomainPattern.test(domain)) {
            return roles.STUDENT;
        }

        if (domain === "pens.ac.id") {
            return roles.LECTURER;
        }

        return null;
    }

    static async getUserById(userId: string): Promise<UserResponse> {
        const result = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        if (!result) {
            throw new ResponseError(404, "User not found");
        }

        return result;
    }

}