import { CustomError } from "../helper/CustomError";
import { Product } from "../models/product.model";

export const ProductService = {
    async getProductById(id: string) {
        try {
            return await Product.findByPk(id)
        } catch (error) {
            throw new CustomError("Product not found", 404);
        }
    }
}