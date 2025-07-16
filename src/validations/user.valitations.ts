import Joi from "joi";
import { CustomError } from "../helper/CustomError";

export class Validations {
    static async LoginAdminValidations(data:any) {
        return Joi.object({
            fullname:Joi.string().required().error(new CustomError("Fullname is invalid", 400)),
            email:Joi.string().required().email().messages({
                "string.base":"Username should be string",
                "string.email":"Email should be string",
            }),
            password:Joi.string().min(6).alphanum().required().error(new CustomError("Password is invalid", 400))
        }).validateAsync(data)
    }
}