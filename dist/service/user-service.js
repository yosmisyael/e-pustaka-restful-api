"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../model/user-model");
const validation_1 = require("../validation/validation");
const user_validation_1 = require("../validation/user-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static async register(request) {
        const registerRequest = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
        const countEmail = await database_1.db.user.count({
            where: {
                email: registerRequest.email,
            }
        });
        if (countEmail != 0) {
            throw new response_error_1.ResponseError(400, "Email already used");
        }
        registerRequest.password = await bcrypt_1.default.hash(registerRequest.password, 10);
        const user = await database_1.db.user.create({
            data: registerRequest,
        });
        return (0, user_model_1.toUserResponse)(user);
    }
}
exports.UserService = UserService;
