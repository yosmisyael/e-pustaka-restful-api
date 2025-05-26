"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
function toUserResponse(user) {
    return {
        email: user.email,
        name: user.name,
    };
}
