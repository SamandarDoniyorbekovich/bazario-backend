import { Router } from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { CategoryController } from "../../controller/category.controller";
import { upload } from "../../middleware/upload.midlleware";

const router = Router();

// Create new category (requires authentication)
router.post("/", authMiddleWare, upload.single("image"), CategoryController.create);

// Get all categories (public route)
router.get("/", CategoryController.getAll);

// Get category by ID (public route)
router.get("/:id", CategoryController.getById);

// Update category (requires authentication)
router.put("/:id", authMiddleWare, upload.single("image"), CategoryController.update);

// Soft delete category (requires authentication)
router.put("/:id/isActive", authMiddleWare, CategoryController.updateIsActive);

// Hard delete category (requires authentication)
router.delete("/:id/permanent", authMiddleWare, CategoryController.hardDelete);

export default router; 