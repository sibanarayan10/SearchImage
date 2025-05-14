import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
const ImageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    desc: {
      type: String,
    },
    tags: [{ type: String, required: true }],

    cloudinary_publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
ImageSchema.index({ uploadedBy: 1 });
ImageSchema.index({ tags: "text", desc: "text" });

export const Image = mongoose.model("Image", ImageSchema);
