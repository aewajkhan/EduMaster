import JWT from "jsonwebtoken";
import { comparedPassword, hashingPassword } from "../helper/bcrypt.js";
import { userModel } from "../models/userSchema.js";

export const getUserCTrl = async (req, resp) => {
  try {
    const User = await userModel.find();
    return resp.status(200).send({
      success: true,
      message: "All User are Here",
      User,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Error while getting the users",
      error,
    });
  }
};

export const createUserCtrl = async (req, resp) => {
  try {
    const { fname, lname, email, password,role } = req.body;
    // console.log("+++++++",fname,lname,email,password)

    const existingUser = await userModel.findOne({ email: email });
    console.log(existingUser);
    if (existingUser) {
      return resp.status(404).send({
        success: true,
        message: "User allready exist",
      });
    }
    const User = await userModel.create({
      fname,
      lname,
      email,
      role,
      profileImage: req.file?.filename || null,
      password: await hashingPassword(password),
    });
    return resp.status(201).send({
      success: true,
      message: "User created Successfully",
      User,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Error while creating the user",
      error,
    });
  }
};

export const loginUserCtrl = async (req, resp) => {
  try {
    const { email, password } = req.body;

    // console.log(email,password)

    const findUser = await userModel.findOne({ email: email });

    // console.log(findUser)

    if (!findUser) {
      return resp.status(404).send({
        success: true,
        message: "User not found please register first",
      });
    }

    const comparePassword = await comparedPassword(password, findUser.password);

    // console.log("comparePassword", comparePassword);
    if (!comparePassword) {
      return resp.status(500).send({
        success: false,
        message: "Password not match",
      });
    }

    const token = JWT.sign({ id: findUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return resp.status(200).send({
      success: true,
      message: "user login Successfully",
      user: findUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Error while login the user...",
      error,
    });
  }
};

export const testCtrl = async (req, resp) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return resp.status(404).json({ message: "User not found" });

    const imageBase64 = user.profileImage?.toString("base64") || null;

    return resp.status(200).send({
      success: true,
      message: "Successfully tested",
      user,
      profileImage: imageBase64,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "user is not login",
      error,
    });
  }
};

export const updateUserCtrl = async (req, res) => {
  try {
    const id = req.user.id; // from middleware that decoded JWT
    const { fname, lname, email, password } = req.body;

    // Prepare update object
    const updateData = {};
    if (fname) updateData.fname = fname;
    if (lname) updateData.lname = lname;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashingPassword(password);
    if (req.file) {
      updateData.profileImage = req.file?.filename || null;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating the user.",
      error: error.message,
    });
  }
};

export const deleteUserCtrl = async (req, resp) => {
  const _id = req.params;
  const deletedUser = await userModel.findByIdAndDelete(_id);
  if (deletedUser == null) {
    return resp.status(404).send({
      success: true,
      message: "user not found in database",
    });
  }
  return resp.status(200).send({
    success: true,
    message: "user deleted Successfully",
    deletedUser,
  });
  try {
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Error while deleting the user",
    });
  }
};
