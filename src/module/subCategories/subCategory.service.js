import { categoryModel } from "../../database/model/category.model.js";
import { env } from "../../../config/env.service.js";
import { subCategoryModel } from "../../database/model/subcategory.model.js";

export const createSubCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { name, categoryId } = req.body;
    let category = await categoryModel.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "category not found" });
    const exists = await subCategoryModel.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "subCategory already exists" });
    const subCategory = await subCategoryModel.insertMany({ name, categoryId });
    if (category) {
      res
        .status(200)
        .json({ message: "subCategory created", data: subCategory });
    } else {
      res.status(400).json({ message: "subCategory not created" });
    }
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const updateSubCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { id } = req.params;
    const { name, categoryId } = req.body;
    let subCategoryFound = await subCategoryModel.findById(id);
    if (!subCategoryFound) {
      return res.status(404).json({ message: "subCategory not found" });
    }

    const all = {};
    if (name) {
      const exists = await subCategoryModel.findOne({ name });
      if (exists)
        return res.status(400).json({ message: "subCategory already exists" });
      all.name = name;
    }
    if (categoryId) {
      let category = await categoryModel.findById(categoryId);
      if (!category)
        return res.status(404).json({ message: "category not found" });
      all.categoryId = categoryId;
    }
    const subCategory = await subCategoryModel.findByIdAndUpdate(id, all, {
      new: true,
    });
    if (subCategory)
      res
        .status(200)
        .json({ message: "subCategory updated", data: subCategory });
    else res.status(400).json({ message: "subCategory not updated" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const softDeleteSubCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!subCategory)
      return res.status(404).json({ message: "subCategory not found" });
    res
      .status(200)
      .json({ message: "subCategory soft-deleted", data: subCategory });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getAllSubCategories = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const subCategories = await subCategoryModel.find();
    if (subCategories.length)
      res
        .status(200)
        .json({ message: "subCategories fetched", data: subCategories });
    else res.status(404).json({ message: "subCategories not found" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getOneSubCategory = async (req, res) => {
  let { id } = req.params;
  let subCategory = await subCategoryModel.findById(id);
  subCategory?.isActive
    ? res.status(200).json({ message: " found", data: subCategory })
    : res.status(404).json({ message: "subCategory not found" });
};
