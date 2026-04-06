import { couponModel } from "../../database/model/coupon.model";

export const addCoupon = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { type, title, message, price, expiresAt, discountCode } = req.body;
    let all = {};
    all.type = type;
    all.title = title;
    all.message = message;
    all.price = price;
    all.expiresAt = expiresAt;
    all.discountCode = discountCode;
    let coupon = await couponModel.insertMany(all);
    if (!coupon) {
      return res.status(400).json({ message: "Failed to add coupon" });
    }
    res.status(201).json({ message: "Coupon added successfully", coupon });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getAllCouponsAdmin = async (req, res) => {
  if (req.user && req.bearer == 'admin') {

    let { page, limit } = req.query;
    let skip;
    let coupons;
    let totalCoupons;
    let totalPages;
    if (page && limit) {
      skip = (page - 1) * limit;
      coupons = await couponModel.find()
        .skip(skip)
        .limit(limit);
      totalCoupons = await couponModel.countDocuments();
      totalPages = Math.ceil(totalCoupons / limit);
      if (coupons.length == 0) {
        return res.status(404).json({
          message: "No coupons found"
        });
      }
      res.status(200).json({
        message: "Coupons retrieved successfully",
        coupons,
        pagination: {
          currentPage: page,
          totalPages,
          totalCoupons,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    }
    else {
      coupons = await couponModel.find();
      if (coupons.length == 0) {
        return res.status(404).json({
          message: "No coupons found"
        });
      }
      res.status(200).json({
        message: "Coupons retrieved successfully",
        coupons
      });
    }

  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getOneCouponAdmin = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.body;
    let coupon = await couponModel.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon retrieved successfully", coupon });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const editOneCoupon = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.body;
    let { type, title, message, price, expiresAt, discountCode } = req.body;


    let all = {};
    all.type = type;
    all.title = title;
    all.message = message;
    all.price = price;
    all.expiresAt = expiresAt;
    all.discountCode = discountCode;
    let coupon = await couponModel.findByIdAndUpdate(id, all, { new: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon updated successfully", coupon });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const deleteCoupon = async (req, res) => {
  if (req.user && req.bearer == 'admin') {
    let { id } = req.body;
    let coupon = await couponModel.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    coupon.isActive = false;
    await coupon.save();
    res.status(200).json({ message: "Coupon deactivated successfully", coupon });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getAllCouponsUser = async (req, res) => {
  if (req.user) {

    let { page, limit } = req.query;
    let skip;
    let coupons;
    let totalCoupons;
    let totalPages;
    if (page && limit) {
      skip = (page - 1) * limit;
      coupons = await couponModel.find({ isActive: true })
        .skip(skip)
        .limit(limit);
      totalCoupons = await couponModel.countDocuments();
      totalPages = Math.ceil(totalCoupons / limit);
      if (coupons.length == 0) {
        return res.status(404).json({
          message: "No coupons found"
        });
      }
      res.status(200).json({
        message: "Coupons retrieved successfully",
        coupons,
        pagination: {
          currentPage: page,
          totalPages,
          totalCoupons,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    }
    else {
      coupons = await couponModel.find({ isActive: true });
      if (coupons.length == 0) {
        return res.status(404).json({
          message: "No coupons found"
        });
      }
      res.status(200).json({
        message: "Coupons retrieved successfully",
        coupons
      });
    }

  } else {
    res.status(400).json({ message: "for admin only" });
  }
};

export const getOneCouponUser = async (req, res) => {
  if (req.user) {
    let { id } = req.body;
    let coupon = await couponModel.findOne({ id, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon retrieved successfully", coupon });
  } else {
    res.status(400).json({ message: "for admin only" });
  }
};
