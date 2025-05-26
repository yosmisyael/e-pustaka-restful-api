import {CategoryRequest, CategoryResponse} from "../model/category-model";
import {CategoryValidation} from "../validation/category-validation";
import {Validation} from "../validation/validation";
import {db} from "../application/database";
import {Prisma} from "../../generated/prisma";
import {ResponseError} from "../error/response-error";
import CategoryCreateInput = Prisma.CategoryCreateInput;

export class CategoryService {
    static async verifyCategoryExist(identifier: number | string, exclude?: number): Promise<boolean> {
        let whereClause: Prisma.CategoryWhereInput;

        if (typeof identifier === 'number') {
            whereClause = {
                id: identifier,
            };
        } else {
            whereClause = {
                name: identifier,
            };
        }

        if (exclude) {
            whereClause.NOT = {
                id: exclude,
            }
        }

        const count: number = await db.category.count({
            where: whereClause,
        });

        return count > 0;
    }

    static async save(req: CategoryRequest): Promise<CategoryResponse> {
        const request: CategoryRequest = Validation.validate(CategoryValidation.CREATE, req);

        const isExist = await this.verifyCategoryExist(req.name);

        if (isExist) {
            throw new ResponseError(400, "Category already exists");
        }

        const result = await db.category.create({
            data: request as CategoryCreateInput,
        });

        return result as CategoryResponse;
    }

    static async update(categoryId: number, req: CategoryRequest): Promise<CategoryResponse> {
        const request: CategoryRequest = Validation.validate(CategoryValidation.UPDATE, req);

        const isExist = await this.verifyCategoryExist(req.name, categoryId);

        if (isExist) {
            throw new ResponseError(400, "Category already exists");
        }

        const result = await db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: request.name,
            },
        });

        return result as CategoryResponse;
    }

    static async delete(categoryId: number): Promise<void> {
        const isExist = await this.verifyCategoryExist(categoryId);

        if (!isExist) {
            throw new ResponseError(404, "Category not found");
        }

        await db.category.delete({
            where: {
                id: categoryId,
            },
        });
    }
}