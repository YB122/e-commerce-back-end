import { categoryModel } from "../../database/model/category.model.js";
import { env } from "../../../config/env.service.js";
import { subCategoryModel } from "../../database/model/subcategory.model.js";

export const createCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { name } = req.body;
    let categoryImg;
    if (req.file) {
      categoryImg = `${env.base_url}/uploads/${req.file.originalname}`;
    }
    const exists = await categoryModel.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "category already exists" });
    const category = await categoryModel.insertMany({ name, categoryImg });
    if (category) {
      res.status(200).json({ message: "category created", data: category });
    } else {
      res.status(400).json({ message: "category not created" });
    }
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const updateCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { id } = req.params;
    const { name } = req.body;
    let categoryFound = await categoryModel.findById(id);
    if (!categoryFound) {
      return res.status(404).json({ message: "category not found" });
    }
    let categoryImg;
    if (req.file) {
      categoryImg = `${env.base_url}/uploads/${req.file.originalname}`;
    }
    const all = {};
    if (name) {
      const exists = await categoryModel.findOne({ name });
      if (exists)
        return res.status(400).json({ message: "category already exists" });
      all.name = name;
    }
    categoryImg ? (all.categoryImg = categoryImg) : null;
    const category = await categoryModel.findByIdAndUpdate(id, all, {
      new: true,
    });
    if (category)
      res.status(200).json({ message: "category updated", data: category });
    else res.status(400).json({ message: "category not updated" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const softDeleteCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!category)
      return res.status(404).json({ message: "category not found" });
    res.status(200).json({ message: "category soft-deleted", data: category });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getAllCategoriesAdmin = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const categories = await categoryModel.find();
    if (categories.length)
      res.status(200).json({ message: "categories fetched", data: categories });
    else res.status(404).json({ message: "categories not found" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getOneCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let { id } = req.params;
    let category = await categoryModel.findById(id);
    if (category) {
      res.status(200).json({ message: "category found", data: category });
    } else {
      res.status(404).json({ message: "category not found" });
    }
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getAllCategoriesUser = async (req, res) => {
  const categories = await categoryModel.find({ isActive: true });
  if (categories.length)
    res.status(200).json({ message: "categories fetched", data: categories });
  else res.status(404).json({ message: "categories not found" });
};

export const getSubcategoriesByCategory = async (req, res) => {
  let { id } = req.params;
  const category = await categoryModel.findById(id);
  if (category?.isActive) {
    let subCategories = await subCategoryModel.find({ categoryId: id });
    if (subCategories.length) {
      res
        .status(200)
        .json({ message: "subCategories found", data: subCategories });
    } else {
      res.status(404).json({ message: "subCategories not found" });
    }
  } else {
    res.status(404).json({ message: "category not found" });
  }
};
