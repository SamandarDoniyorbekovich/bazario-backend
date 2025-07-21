import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helper/CustomError";
import { Category } from "../models/category.model";
import { CategoryValidations } from "../validations/category.validations";
import { removeFile } from "../helper/removeFile";

export const CategoryController = {
  // Create new category complete checked
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, isActive, sortOrder } = await CategoryValidations.CreateCategoryValidation(req.body);

      // Check if category with same name already exists
      const existingCategory = await Category.findOne({
        where: { name }
      });

      const newCategory = await Category.create({
        name: JSON.parse(name),
        description: JSON.parse(description),
        image: req?.file?.filename,
        sortOrder: sortOrder || 0,
        isActive: isActive || true
      });

      res.status(201).json({
        ok: true,
        message: "Category created successfully",
        category: newCategory
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all categories complete checked
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await Category.findAll({
        where: { isActive: true },
        order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
      });

      res.status(200).json({
        ok: true,
        categories,
        count: categories.length
      });
    } catch (error) {
      next(error);
    }
  },

  // Get category by ID complete checked
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await Category.findOne({
        where: { id, isActive: true }
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      res.status(200).json({
        ok: true,
        category
      });
    } catch (error) {
      next(error);
    }
  },

  // Update category
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);

      const { id } = req.params;
      const { name, description, image, sortOrder, isActive } = req.body;

      const category = await Category.findOne({
        where: { id }
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      // Check if name is being updated and if it already exists
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({
          where: { name, id: { [require('sequelize').Op.ne]: id } }
        });

        if (existingCategory) {
          throw new CustomError("Category with this name already exists", 400);
        }
      }

      await category.update({
        name: name || category.name,
        description: description !== undefined ? description : category.description,
        image: image !== undefined ? image : category.image,
        sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
        isActive: isActive !== undefined ? isActive : category.isActive
      });

      res.status(200).json({
        ok: true,
        message: "Category updated successfully",
        category
      });
    } catch (error) {
      console.log(`Failed to update category: ${error}`);
      next(error);
    }
  },

  // Updateing category (soft delete by setting isActive to false) complete checked
  async updateIsActive(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.params);

      const { id } = req.params;

      const category = await Category.findOne({
        where: { id }
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }
      if (category?.isActive === false) {
        await category.update({ isActive: true });
        res.status(200).json({
          ok: true,
          message: "Category activated successfully",
          data: category
        });
      } else {
        await category.update({ isActive: false });
        res.status(200).json({
          ok: true,
          message: "Category deactivated successfully",
          data: category
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Hard delete category complete checked
  async hardDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await Category.findOne({
        where: { id }
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      await removeFile(category?.image)
      await category.destroy();

      res.status(200).json({
        ok: true,
        message: "Category permanently deleted"
      });
    } catch (error) {
      next(error);
    }
  }
}; 