import Joi from "joi";
import { CustomError } from "../helper/CustomError";

export class Validations {
    static async LoginAdminValidations(data: any) {
        return Joi.object({
            email: Joi.string().email().required().messages({
                "string.base": "Email should be a string",
                "string.email": "Please provide a valid email address",
                "any.required": "Email is required"
            }),
            password: Joi.string().min(5).required().messages({
                "string.base": "Password should be a string",
                "string.min": "Password must be at least 6 characters long",
                "any.required": "Password is required"
            })
        }).validateAsync(data)
    }
}