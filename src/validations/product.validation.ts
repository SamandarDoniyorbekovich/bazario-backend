import Joi from "joi";

export class ProductValidation {
    static createProductValidation = Joi.object({
        name: Joi.string().required().messages({
            "string.base": "Name should be a stringified object",
            "any.required": "Name is required",
            "any.invalid": "Name must be a valid JSON object string",
        }),
        description: Joi.string().optional().messages({
            "string.base": "Description should be a stringified object",
            "any.invalid": "Description must be a valid JSON object string",
        }),
        price: Joi.number().required().messages({
            "number.base": "Price should be a number",
            "any.required": "Price is required",
            "any.invalid": "Price must be a valid number",
        }),
        stock: Joi.number().required().messages({
            "number.base": "Stock should be a number",
            "any.required": "Stock is required",
        }),
        minStock: Joi.number().optional().messages({
            "number.base": "Min stock should be a number",
            "any.invalid": "Min stock must be a valid number",
        }),
        isActive: Joi.boolean().optional().messages({
            "boolean.base": "Is active should be a boolean",
        }),
        images: Joi.alternatives().try(Joi.array().items(Joi.string()),Joi.string()).optional().messages({
            "alternatives.types": "Images should be an array of strings or a single string",
        }),
        // categoryId: Joi.string().required().messages({
        //     "string.base": "Category ID should be a string",
        //     "any.required": "Category ID is required",
        // }),
    });
}