import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const FollowSchema = new Schema(
  {
    following: { type: Schema.Types.ObjectId, ref: User },
    follower: { type: Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
);
FollowSchema.index({ follower: 1 });
FollowSchema.index({ following: 1 });
FollowSchema.index({ following: 1, follower: 1 }, { unique: true });

export const Follow =
  mongoose.models.Follow || mongoose.model("Follow", FollowSchema);
