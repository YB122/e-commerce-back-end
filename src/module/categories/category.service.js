import { categoryModel } from "../../database/model/category.model.js";
import { env } from "../../../config/env.service.js";

export const createCategory = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    const { name } = req.body;
    let photo;
    if (req.file) {
      photo = `${env.base_url}/uploads/${req.file.originalname}`;
    }
    const exists = await categoryModel.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "category already exists" });
    const category = await categoryModel.insertMany({ name, photo });
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
    let photo;
    if (req.file) {
      photo = `${env.base_url}/uploads/${req.file.originalname}`;
    }
    const all = {};
    name ? (all.name = name) : null;
    photo ? (all.photo = photo) : null;
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

export const getAllCategories = async (req, res) => {
  const categories = await categoryModel.find({ isActive: true });
  if (categories)
    res.status(200).json({ message: "categories fetched", data: categories });
  else
    res.status(404).json({ message: "categories not fetched" });
};
