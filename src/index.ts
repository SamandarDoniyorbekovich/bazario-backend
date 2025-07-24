import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config();
import { urlencoded } from "body-parser"
import sequelize from "./db/database";
import adminUserRoute from "./routes/admin/user.routes"
import adminCAtegory from "./routes/admin/category.routes"
import { initAdmin } from "./helper/init";
import { errorMiddleware } from "./middleware/errorMiddleware";
import path from "path";
import adminProduct from "./routes/admin/product.routes";

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
    console.log("hello wordl");
})

app.use("/admin/auth", adminUserRoute)
app.use("/admin/category", adminCAtegory)
app.use("/admin/product", adminProduct)
app.use("/files", express.static(path.join(__dirname, "./public/files")))
app.use(errorMiddleware)

const startServer = async () => {
    try {
        sequelize.authenticate()
        console.log("Connect db");
        sequelize.sync({ })
        await initAdmin()
        app.listen(port, () => {
            console.log(`Server running on: ${port}`);

        })
    } catch (error) {
        console.log(error);

    }
}

startServer()