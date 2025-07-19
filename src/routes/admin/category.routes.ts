import { Router } from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { CategoryController } from "../../controller/category.controller";

const router = Router();

// Create new category (requires authentication)
router.post("/", authMiddleWare, CategoryController.create);

// Get all categories (public route)
router.get("/", CategoryController.getAll);

// Get category by ID (public route)
router.get("/:id", CategoryController.getById);

// Update category (requires authentication)
router.put("/:id", authMiddleWare, CategoryController.update);

// Soft delete category (requires authentication)
router.delete("/:id", authMiddleWare, CategoryController.delete);

// Hard delete category (requires authentication)
router.delete("/:id/permanent", authMiddleWare, CategoryController.hardDelete);

export default router; 