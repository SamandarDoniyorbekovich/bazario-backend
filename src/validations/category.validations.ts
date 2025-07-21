import Joi from "joi";

export class CategoryValidations {
    static async CreateCategoryValidation(data: any) {
        return await Joi.object({
            name: Joi.string().required().messages({
                "string.base": "Name should be a stringified object",
                "any.required": "Name is required",
                "any.invalid": "Name must be a valid JSON object string",
            }),
            description: Joi.string().optional().messages({
                "string.base": "Description should be a stringified object",
                "any.invalid": "Description must be a valid JSON object string",
            }),
            image: Joi.string().optional(),
            isActive: Joi.boolean().default(true),
            sortOrder: Joi.number().integer().optional().messages({
                "number.base": "Sort order must be a number",
                "number.integer": "Sort order must be an integer"
            })
        }).validateAsync(data);
    }
} 