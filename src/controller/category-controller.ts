import {Request, Response, NextFunction} from 'express';
import {CategoryRequest, CategoryResponse} from "../model/category-model";
import {CategoryService} from "../service/category-service";

export class CategoryController {
    static async addCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CategoryRequest = req.body as CategoryRequest;

            const response: CategoryResponse = await CategoryService.save(request);

            res.status(201).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId: number = Number(req.params.categoryId);

            const request: CategoryRequest = req.body as CategoryRequest;

            const response: CategoryResponse = await CategoryService.update(categoryId, request);

            res.status(200).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getCategoryById(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId: number = Number(req.params.categoryId);

            const response: CategoryResponse = await CategoryService.getCategoryById(categoryId);

            res.status(200).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async searchCategory(req: Request, res: Response, next: NextFunction) {
        try {
            let name = req.query.name;

            if (!name || typeof name !== 'string') {
                name = "";
            }

            const response: CategoryResponse[] = await CategoryService.getCategoryByName(name);

            res.status(200).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const response: CategoryResponse[] = await CategoryService.getAllCategories();

            res.status(200).json({
                data: response,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId: number = Number(req.params.categoryId);

            await CategoryService.delete(categoryId);

            res.status(200).json({
                data: {
                    message: "OK",
                },
            });
        } catch (err) {
            next(err);
        }
    }
}