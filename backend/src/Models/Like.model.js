import mongoose, { Schema } from "mongoose";
import { Image } from "./Image.model.js";
import { User } from "./User.model.js";

const LikeSchema = new mongoose.Schema(
  {
    image: {
      type: Schema.Types.ObjectId,
      ref: Image,
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

LikeSchema.index({ image: 1 });
LikeSchema.index({ likedBy: 1 });

export const Like = mongoose.model("Like", LikeSchema);
