import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'courses',
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export const CartModel = mongoose.model('carts', cartSchema);
