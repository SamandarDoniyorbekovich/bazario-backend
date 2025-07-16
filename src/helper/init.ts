import { User } from "../models/user.model"
import { getHashPasswort } from "./bcrypt"

export const initAdmin = async () => {
    const users = await User.findAll()
    
    if (!users.length) {
        const hashedPass = getHashPasswort("admin")
        const newAdmin = await User.create({
            fullname: "Admin",
            email: "admin@gmial.com",
            password: hashedPass,
            role: "admin"
        })
        console.log(newAdmin);
    }

}