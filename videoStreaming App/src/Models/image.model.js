import mongoose, { Schema } from 'mongoose'
import {User }from './user.model.js'
const imageSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    cloudinary_Assetid: {
        type: String,
        required: true
    },
    cloudinary_publicId: {
        type: String,
        required: true
    }
}, { timestamps: true })
imageSchema.index({ desc:'text' });


export const Image = mongoose.model("Image", imageSchema);