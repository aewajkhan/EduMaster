import { contactModel } from "../models/contactModel.js";


export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!userId || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newContact = new contactModel({ userId, name, email, message });
    await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error in contact controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

