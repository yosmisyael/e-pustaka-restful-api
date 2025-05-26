import {roles, User} from "../../generated/prisma";

export type UserResponse = {
    email?: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
}

export type RegisterUserRequest = {
    email: string;
    name: string;
    password: string;
    role?: roles
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type RefreshTokenRequest = {
    refreshToken: string;
}

export type ResetPasswordRequest = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// User payload for JWT
export type UserPayload = {
    sub: string;
    email: string;
    name: string;
    role: roles;
}

// Returned JWT token payload
export type TokenPayload = {
    accessToken?: string;
    refreshToken?: string;
}

// User object in request
export type UserInfo = {
    id: string,
    name: string,
    email: string,
    role: roles,
}

export function toUserResponse(user: User): UserResponse {
    return {
        email: user.email,
        name: user.name,
    }
}