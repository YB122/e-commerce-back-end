import { userModel } from "../../database/model/user.model.js";

export const getOwnProfile = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (!userFound && !userFound.isActive) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user found", data: userFound });
  } else {
    res.status(400).json({ message: "login first" });
  }
};

export const updateProfile = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (!userFound && !userFound.isActive) {
      return res.status(404).json({ message: "user not found" });
    }
    let { name, phone,city, country,street,zipcode} = req.body;
    let avatar;
    if (req.file) {
      avatar = `${env.base_url}/uploads/${req.file.originalname}`;
    }
    let all = {};
    name ? (all.name = name) : null;
    phone ? (all.phone = phone) : null;
    avatar ? (all.avatar = avatar) : null;
    all.city = city;
    all.country = country;
    all.street = street;
    all.zipcode = zipcode;
    let user = await userModel.findByIdAndUpdate(req.user._id, all, {
      new: true,
    });
    if (user) {
      res.status(200).json({ message: "data updated correct", data: user });
    } else {
      res.status(400).json({ message: "data not updated" });
    }
  } else {
    res.status(400).json({ message: "login first" });
  }
};

export const softDelete = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (!userFound && !userFound.isActive) {
      return res.status(404).json({ message: "user not found" });
    }
    let user = await userModel.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true },
    );
    if (user) {
      res.status(200).json({ message: "user deleted", data: user });
    } else {
      res.status(400).json({ message: "user not deleted" });
    }
  } else {
    res.status(400).json({ message: "login first" });
  }
};

export const uploadProfileImage = async (req, res) => {
  if (req.user) {
    let userFound = await userModel.findById(req.user._id);
    if (!userFound && !userFound.isActive) {
      return res.status(404).json({ message: "user not found" });
    }
    let profileImage;
    if (req.file) {
      profileImage = `${env.base_url}/uploads/${req.file.originalname}`;
      let user = await userModel.findByIdAndUpdate(
        req.user._id,
        { profileImage },
        { new: true },
      );
      if (user) {
        res.status(200).json({ message: "image upload correct", data: user });
      } else {
        res.status(400).json({ message: "error in upload image" });
      }
    } else {
      res.status(400).json({ message: "must upload image" });
    }
  } else {
    res.status(400).json({ message: "login first" });
  }
};
