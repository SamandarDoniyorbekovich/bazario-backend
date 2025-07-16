import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || "" 

export const genereteAccesToken = (data: any) => {
    return jwt.sign(data, JWT_SECRET, {
        expiresIn:"1d",
    })
}

export const genereteRefreshToken = (data: any) => {
    return jwt.sign(data, JWT_SECRET, {
        expiresIn:"7d",
    })
}

export const chekToekn = (token:string) =>{
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return false
    }
}