import { CartModel } from '../models/cartModel.js';
import { CourseModel } from '../models/courseModel.js';


export const addToCart = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id; 
    // console.log("user.id",req.user.id)


  try {
    const course = await CourseModel.findById(courseId);
    // console.log("course",course)
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let cart = await CartModel.findOne({ userId });
    // console.log("cart",cart)

    if (!cart) {
      cart = new CartModel({ userId, courses: [] });
    }

    const alreadyAdded = cart.courses.some(
      (c) => c.courseId.toString() === courseId
    );

    if (alreadyAdded)
      return res.status(400).json({ message: 'Course already in cart' });

    cart.courses.push({
      courseId: course._id,
      title: course.title,
      image: course.image,
      price: course.price,
      description: course.description,
    });

    await cart.save();
    res.status(201).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.courses = cart.courses.filter(
      (c) => c.courseId.toString() !== courseId
    );
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
