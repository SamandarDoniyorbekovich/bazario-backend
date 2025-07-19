import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helper/CustomError";
import { compareHashPass } from "../helper/bcrypt";
import { User } from "../models/user.model";
import { chekToekn, genereteAccesToken, genereteRefreshToken } from "../helper/jwt";
import { Validations } from "../validations/user.valitations";


export const UserController = {


  async login(req: Request, res: Response, next: NextFunction) {
    try {

      const { email, password } = await Validations.LoginAdminValidations(req?.body)
      console.log(email);
      
      const userIsExists = await User.findOne({
        where: {
          email
        },
      });
      if (!userIsExists) {
        throw new CustomError("this user does not exists", 400)
      }
      const isEqual = compareHashPass(password, userIsExists?.dataValues.password)

      if (!isEqual) {
        throw new CustomError("Password is incorrect", 400)
      }

      // console.log(userIsExists?.dataValues?.id);

      const targetUser = await User.findOne({
        where: { email },
        attributes: {
          exclude: ["password"]
        }
      })
      console.log(targetUser);

      res.status(200).json({
        ok: true,
        massege: "login successfully",
        user: targetUser,
        accessToken: genereteAccesToken({
          userId: userIsExists?.dataValues?.id
        }),
        refreshToken: genereteRefreshToken({
          userId: userIsExists?.dataValues?.id
        })
      });
    } catch (error) {
      next(error)
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {

    try {
      // @ts-ignore
      console.log(req.userId);

      // @ts-ignore
      const userId = req?.userId
      const targetUser = await User.findOne({
        where: {
          id: userId
        },
        attributes: {
          exclude: ["password"]
        }
      })
      res.status(200).json({
        ok: true,
        user: targetUser,
      });
    } catch (error) {
      next(error)
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {

    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        throw new CustomError("refreshToken not found", 401)
      }

      const isValid = chekToekn(refreshToken)
      if (!isValid) {
        throw new CustomError("refreshToken is invalid", 401)
      }

      const targetUser = await User.findOne({
        where: {
          // @ts-ignore
          id: isValid?.userId
        }
      })

      if (!targetUser) {
        throw new CustomError("user not found with this token!", 401)
      }

      res.status(200).json({
        ok: true,
        accessToken: genereteAccesToken({
          userId: targetUser?.id
        })
      })
    } catch (error) {
      next(error)
    }
  },

}