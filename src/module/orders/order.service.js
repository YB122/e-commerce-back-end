import { orderModel } from "../../database/model/order.model";
import { userModel } from "../../database/model/user.model.js";
import { cartModel } from "../../database/model/cart.model.js";
import { productModel } from "../../database/model/product.model.js";

export const addOrder = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let { productIds, paymentMethod } = req.body;

      if (!paymentMethod) {
        return res.status(400).json({ message: "valid paymentMethod is required" });
      }

      if (!productIds || !Array.isArray(productIds) || productIds.length == 0) {
        return res.status(400).json({ message: "productIds are required" });
      }

      let userAddress = null;
      if (userFound.street && userFound.city && userFound.zipcode && userFound.country) {
        userAddress = {
          street: userFound.street,
          city: userFound.city,
          zipCode: userFound.zipcode,
          country: userFound.country
        };
      } else {
        return res.status(400).json({ message: "complete shippingAddress is required or update your profile address" });
      }

      let cartItems = await cartModel.find({
        userId: req.user._id,
        productId: { $in: productIds }
      });

      if (cartItems.length == 0) {
        return res.status(404).json({ message: "no selected items found in cart" });
      }

      let cartProductIds = cartItems.map(item => item.productId);
      let missingProducts = productIds.filter(id => !cartProductIds.includes(id));
      if (missingProducts.length > 0) {
        return res.status(400).json({
          message: "some products are not in your cart",
          missingProducts
        });
      }

      let orderItems = [];
      let totalAmount = 0;
      let totalPrice = 0;

      for (let cartItem of cartItems) {
        let product = await productModel.findById(cartItem.productId);

        if (!product?.isActiveAdmin || !product?.isActiveUser) {
          return res.status(400).json({ message: `product ${cartItem.productId} is not available` });
        }

        if (product.stock < cartItem.quantity) {
          return res.status(400).json({ message: `product ${product.name} has insufficient stock` });
        }

        if (cartItem.price !== product.price) {
          return res.status(400).json({
            message: `price changed for product ${product.name}. Cart price: ${cartItem.price}, Current price: ${product.price}`
          });
        }

        orderItems.push({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: product.price
        });

        totalAmount += cartItem.quantity;
        totalPrice += cartItem.quantity * product.price;
      }

      let paymentStatus = paymentMethod == 'card' ? 'paid' : 'pending';

      let newOrder = await orderModel.create({
        userId: req.user._id,
        items: orderItems,
        totalAmount,
        totalPrice,
        paymentMethod,
        paymentStatus,
        shippingAddress: userAddress
      });

      if (newOrder) {
        let stockUpdateErrors = [];

        for (let item of orderItems) {
          try {
            await productModel.findByIdAndUpdate(
              item.productId,
              { $inc: { stock: -item.quantity } }
            );
          } catch (error) {
            stockUpdateErrors.push({
              productId: item.productId,
              error: error.message
            });
          }
        }

        if (stockUpdateErrors.length > 0) {
          await orderModel.findByIdAndDelete(newOrder._id);
          return res.status(500).json({
            message: "stock update failed",
            errors: stockUpdateErrors
          });
        }

        let cartProductIds = cartItems.map(item => item.productId);
        await cartModel.deleteMany({
          userId: req.user._id,
          productId: { $in: cartProductIds }
        });

        res.status(201).json({ message: "order created successfully", data: newOrder });
      } else {
        res.status(400).json({ message: "order not created" });
      }
    } else {
      res.status(403).json({ message: "account not found or inactive" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const getMyOrders = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let { page = 1, limit = 0, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      page = +page;
      limit = +limit;

      let query = { userId: req.user._id };
      let sortOptions = { [sortBy]: sortOrder == 'desc' ? -1 : 1 };

      let ordersQuery = orderModel.find(query).sort(sortOptions);

      if (limit > 0) {
        const skip = (page - 1) * limit;
        ordersQuery = ordersQuery.skip(skip).limit(limit);
      }

      let orders = await ordersQuery.exec();

      if (orders.length) {
        res.status(200).json({
          message: "orders found",
          data: orders
        });
      } else {
        res.status(404).json({ message: "no orders found" });
      }
    } else {
      res.status(403).json({ message: "account not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const getMyOrder = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (userFound?.isActive) {
      let { id } = req.params;
      let order = await orderModel.findById(id);

      if (!order) {
        return res.status(404).json({ message: "no order found" });
      }

      if (order.userId != req.user._id) {
        return res.status(403).json({ message: "access denied: this order doesn't belong to you" });
      }

      res.status(200).json({ message: "order found", data: order });
    } else {
      res.status(403).json({ message: "account not found" });
    }
  } else {
    res.status(401).json({ message: "login first" });
  }
};

export const getAllOrders = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let { page = 1, limit = 0, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    page = +page;
    limit = +limit;

    let query = {};
    let sortOptions = { [sortBy]: sortOrder == 'desc' ? -1 : 1 };

    let ordersQuery = orderModel.find(query).sort(sortOptions);

    if (limit > 0) {
      const skip = (page - 1) * limit;
      ordersQuery = ordersQuery.skip(skip).limit(limit);
    }

    let orders = await ordersQuery.exec();

    if (orders.length) {
      res.status(200).json({
        message: "orders found",
        data: orders
      });
    } else {
      res.status(404).json({ message: "no orders found" });
    }
  } else {
    res.status(401).json({ message: "admin only" });
  }
};

export const updateOrderStatus = async (req, res) => {
  if (req.user && req.bearer == "admin") {
    let { orderStatus } = req.body;
    let { id } = req.params;
    let order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    let updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true },
    );
    updatedOrder
      ? res.status(200).json({ message: "orderStatus updated", updatedOrder })
      : res.status(400).json({ message: "orderStatus not updated" });
  } else {
    res.status(401).json({ message: "admin only" });
  }
};
