import { userModel } from "../models/userSchema.js";

export const isAdmin = async (req, response, next) => {
  try {
    const _id = req.user.id;
    const findUSer = await userModel.findById(_id);
    console.log(findUSer);

    if (findUSer.role === "admin") {
        next();
    }
  } catch (error) {
    console.log(error);
  }
};
