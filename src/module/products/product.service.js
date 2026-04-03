import { categoryModel } from "../../database/model/category.model";
import { productModel } from "../../database/model/product.model";
import { subCategoryModel } from "../../database/model/subcategory.model";

export const addProduct = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let { subCategoryId, categoryId, stock, price, description, name } =
      req.body;
    let existsName = await productModel.findOne({ name });
    if (existsName)
      return res.status(400).json({ message: "product already exists" });
    let subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "subCategory not found" });
    }
    let category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    if (subCategory.categoryId != categoryId) {
      return res
        .status(404)
        .json({ message: "this subCategory not for this category" });
    }
    if (stock <= 0 && price <= 0)
      return res
        .status(400)
        .json({ message: "stock and price must be more than 0" });
    let product = await productModel.insertMany({
      subCategoryId,
      categoryId,
      stock,
      price,
      description,
      name,
    });
    if (product)
      res.status(200).json({ message: "done, product added", data: product });
    else res.status(400).json({ message: "failed, product not added" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};
export const updateProduct = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let { id } = req.params;
    let productFound = await productModel.findById(id);
    if (!productFound) {
      return res.status(404).json({ message: "product not found" });
    }
    let { subCategoryId, categoryId, stock, price, description, name } =
      req.body;
    let all = {};
    let categoryFound = await categoryModel.findById(categoryId);
    if (categoryFound) {
      let subCategoryFound = await subCategoryModel.findById(subCategoryId);
      if (subCategoryFound) {
        if (subCategoryFound.categoryId == categoryId) {
          if (productFound.name != name) {
            let productNameFound = await productModel.fineOne({ name });
            if (productNameFound)
              return res
                .status(400)
                .json({ message: "product already exists" });
          }
          all.name = name;
          all.subCategoryId = subCategoryId;
          all.categoryId = categoryId;
          all.stock = stock;
          all.price = price;
          all.description = description;
        } else {
          return res
            .status(404)
            .json({ message: "this category not for this subCategory" });
        }
      } else {
        return res.status(404).json({ message: "subCategory not found" });
      }
    } else {
      return res.status(404).json({ message: "category not found" });
    }
    let product = await findByIdAndUpdate(id, all, { new: true });
    product
      ? res.status(200).json({ message: "product updated done", data: product })
      : res.status(400).json({ message: "product not updated" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};
export const softDeleteProduct = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let { id } = req.params;
    let product = await productModel.findByIdAndUpdate(
      id,
      { isActiveAdmin: false },
      { new: true },
    );
    if (product)
      res
        .status(200)
        .json({ message: "product softDeleted done", data: product });
    else
      res.status(404).json({ message: "product not softDeleted or not found" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};
export const getAllProductsAdmin = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let products = await productModel.find();
    products.length
      ? res.status(200).json({ message: "products found", data: products })
      : res.status(404).json({ message: "products not found" });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};
