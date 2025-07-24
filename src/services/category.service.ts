import { Category } from "../models/category.model";
import { CustomError } from "../helper/CustomError";

export const categoryService = {
    async getCategoryById(id: string) {
        try {
            return await Category.findByPk(id)
             
        } catch (error) {
            throw new CustomError("Category not found", 404);
        }
    },
    async removeCategoryById(id: string) {
        try {
            await Category.destroy({ where: { id } })
        } catch (error) {
            throw new CustomError("Category not found", 404);
        }
    }
}