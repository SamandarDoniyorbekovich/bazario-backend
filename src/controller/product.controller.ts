import { Request, Response, NextFunction } from "express";
import { Product } from "../models/product.model";
import { ProductValidation } from "../validations/product.validation";
import { CustomError } from "../helper/CustomError";
import { ProductService } from "../services/product.services";
import { removeFile } from "../helper/removeFile";

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
        console.log("req.files", req.files);
        
        try {
            const { id } = req.params;
            const { name, description, price, stock, minStock } = await ProductValidation.createProductValidation.validateAsync(req.body);
            const product = await ProductService.getProductById(id);
            console.log(product);
            
            if (!product) {
                throw new CustomError("Product not found", 404);
            }
            if (name && name !== product.name) {
                const existingProduct = await Product.findOne({ where: { name, id: { [require('sequelize').Op.ne]: id } } });
                if (existingProduct) {
                    throw new CustomError("Product with this name already exists", 400);
                }
            }
            if (req.files && product.images) {
                await removeFile(product.images);
            }
            await product.update({
                name: typeof name === "string" ? JSON.parse(name) : name || product.name,
                description: typeof description === "string" ? JSON.parse(description) : description || product.description,
                price: price || product.price,
                images: Array.isArray(req.files) ? req.files.map((file: any) => file.filename) : product.images,
                stock: stock || product.stock,
                minStock: minStock || product.minStock,
            });
            res.status(200).json({
                ok: true,
                message: "Product updated successfully",
                product
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
            await removeFile(product.images);
            await product.destroy();
            res.status(200).json({
                ok: true,
                message: "Product deleted successfully",
                product
            })
        } catch (error) {
            next(error)
        }
    }
}