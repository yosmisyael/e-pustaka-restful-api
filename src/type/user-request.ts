import {Request} from "express";
import {UserInfo} from "../model/user-model";

export interface UserRequest extends Request {
    user?: UserInfo;
}