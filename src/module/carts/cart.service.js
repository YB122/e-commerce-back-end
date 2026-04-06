import { cartModel } from "../../database/model/cart.model.js";
import { userModel } from "../../database/model/user.model.js";
import { productModel } from "../../database/model/product.model.js";

export const addItemToCart = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let { productId, quantity } = req.body;
      let productFound = await productModel.findById(productId);
      if (productFound?.isActiveAdmin && productFound?.isActiveUser) {
        if (!quantity) quantity = 1;
        if (productFound.stock >= +quantity) {
          let existingCartItem = await cartModel.findOne({
            userId: req.user._id,
            productId,
          });

          if (existingCartItem) {
            let newQuantity = existingCartItem.quantity + +quantity;
            if (productFound.stock >= newQuantity) {
              let updatedItem = await cartModel.findByIdAndUpdate(
                existingCartItem._id,
                { quantity: newQuantity },
                { new: true }
              );
              updatedItem
                ? res
                  .status(200)
                  .json({ message: "cart quantity updated", data: updatedItem })
                : res.status(400).json({ message: "failed to update cart" });
            } else {
              return res
                .status(404)
                .json({ message: "we haven't that quantity of this product" });
            }
          } else {
            let addItem = await cartModel.insertMany({
              userId: req.user._id,
              productId,
              quantity,
            });
            addItem
              ? res
                .status(200)
                .json({ message: "product add to cart", data: addItem })
              : res.status(400).json({ message: "product failed add to cart" });
          }
        } else {
          return res
            .status(404)
            .json({ message: "we haven't that quantity of this product" });
        }
      } else {
        res.status(404).json({ message: "product not found" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const updateProductQuantity = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let { productId } = req.params;
      let product = await productModel.findById(productId);
      if (!product?.isActiveAdmin || !product?.isActiveUser) {
        return res.status(404).json({ message: "product not found" });
      }
      let cartItem = await cartModel.findOne({
        userId: req.user._id,
        productId,
      });

      if (!cartItem) {
        return res
          .status(404)
          .json({ message: "product not found in your cart" });
      }
      let { quantity } = req.body;
      if (+quantity >= 1) {
        if (product.stock >= +quantity) {
          let cartUpdate = await cartModel.findByIdAndUpdate(
            cartItem._id,
            { quantity: +quantity },
            { new: true },
          );
          if (cartUpdate) {
            res
              .status(200)
              .json({ message: "quantity updated", data: cartUpdate });
          } else {
            res.status(400).json({ message: "cart not updated" });
          }
        } else {
          return res
            .status(404)
            .json({ message: "we haven't that quantity of this product" });
        }
      } else {
        return res
          .status(400)
          .json({ message: "quantity must be more than 1" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const viewCart = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let cartItems = await cartModel.find({ userId: req.user._id });
      if (cartItems.length) {
        const inactiveCartItems = [];

        for (const cartItem of cartItems) {
          const product = await productModel.findById(cartItem.productId);
          if (!product?.isActiveAdmin || !product?.isActiveUser) {
            inactiveCartItems.push(cartItem._id);
          }
        }

        if (inactiveCartItems.length > 0) {
          const deleteResult = await cartModel.deleteMany({
            _id: { $in: inactiveCartItems },
          });
          if (deleteResult.deletedCount > 0) {
            cartItems = await cartModel.find({ userId: req.user._id });
            if (cartItems.length == 0) {
              return res.status(404).json({
                message: "your cart is empty after removing inactive products",
              });
            }
          }
        }

        res.status(200).json({ message: "success", data: cartItems });
      } else {
        res.status(404).json({ message: "your cart is empty" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const removeItemFromCart = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let { productId } = req.params;
      let product = await productModel.findById(productId);
      if (!product?.isActiveAdmin || !product?.isActiveUser) {
        return res.status(404).json({ message: "product not found" });
      }
      let cartItem = await cartModel.findOne({
        userId: req.user._id,
        productId,
      });
      if (!cartItem)
        return res.status(404).json({ message: "item not found in your cart" });
      let deletedItem = await cartModel.findByIdAndDelete(cartItem._id, {
        new: true,
      });
      if (deletedItem)
        res.status(200).json({ message: "cart deleted", data: deletedItem });
      else res.status(400).json({ message: "cart not deleted" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const clearCart = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let deleteResult = await cartModel.deleteMany({ userId: req.user._id });
      if (deleteResult.deletedCount > 0) {
        res.status(200).json({
          message: "cart cleared successfully",
          data: deleteResult,
        });
      } else {
        res.status(404).json({ message: "cart is already empty" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};
