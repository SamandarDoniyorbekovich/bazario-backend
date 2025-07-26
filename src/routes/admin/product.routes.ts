import { Router } from "express";
import { ProductController } from "../../controller/product.controller";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { upload } from "../../middleware/upload.midlleware";

const router = Router()

// get all products
router.get("/", ProductController.getProducts)

// get product by id
router.get("/:id", ProductController.getProductById)

// update product
router.put("/:id", authMiddleWare, upload.array("image"), ProductController.updateProduct)

// delete product
router.delete("/:id", authMiddleWare, ProductController.deleteProduct)

// create product
router.post("/", authMiddleWare, upload.array("image", 10), ProductController.createProduct)



export default router 