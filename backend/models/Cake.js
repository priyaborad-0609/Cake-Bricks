import mongoose from "mongoose";

const cakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    category: {
      type: String,
      required: true,
      enum: ["Birthday", "Wedding", "Anniversary", "Custom"],
    },

    egg: {
      type: Boolean,
      default: true, 
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, 
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cake", cakeSchema);
