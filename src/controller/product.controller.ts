import { Request, Response, NextFunction } from "express";
import { Product } from "../models/product.model";
import { ProductValidation } from "../validations/product.validation";
import { CustomError } from "../helper/CustomError";
import { ProductService } from "../services/product.services";
import { filterImages, removeFile, removeFiles } from "../helper/removeFile";

export const ProductController = {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const { count, rows: products } = await Product.findAndCountAll({
                limit,
                offset,
            })
            res.status(200).json({
                ok: true,
                message: "Products fetched successfully",
                products,
                pagination: {
                    total: count,
                    limit,
                    offset,
                    order: [["createdAt", "DESC"]]
                }
            })
        } catch (error) {
            next(error)
        }
    },
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, price, stock, minStock } = await ProductValidation.createProductValidation.validateAsync(req.body);

            const productImages = Array.isArray(req.files) ? req.files : [];
            console.log(productImages);


            const product = await Product.create(
                {
                    name,
                    description,
                    price,
                    stock,
                    minStock,
                    images: productImages.map((file: any) => file.filename),
                }
            )
            res.status(201).json({
                ok: true,
                message: "Product created successfully",
                product
            })
        } catch (error) {
            next(error)
        }
    },
    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) {
                throw new CustomError("Product not found", 404);
            }
            res.status(200).json({
                ok: true,
                message: "Product fetched successfully",
                product
            })
        } catch (error) {
            next(error)
        }
    },
    async updateProduct(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params;
            const { name, description, price, stock, minStock, images } = await ProductValidation.createProductValidation.validateAsync(req.body);
            const product = await ProductService.getProductById(id);

            if (!product) {
                throw new CustomError("Product not found", 404);
            }


            let newImages = await filterImages(product.images, images, req?.files)

            await product.update({
                name,
                description,
                price,
                images: newImages,
                stock,
                minStock,
            });
            res.status(200).json({
                ok: true,
                message: "Product updated successfully",
                // product
            })
        } catch (error) {
            next(error)
        }
    },
    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            if (!product) {
                throw new CustomError("Product not found", 404);
            }
            await removeFiles(product.images);
            await product.destroy();
            res.status(200).json({
                ok: true,
                message: "Product deleted successfully",
            })
        } catch (error) {
            next(error)
        }
    }
}