import mongoose, { Schema } from 'mongoose'
const VideoSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 30
    },
    videourl: {
        type: String,
        required: true

    },
    coverImageUrl: {
        type: String,
        required: true
    },
    videoCloudinaryId: {
        type: String,
        required: true
    },
    coverImageCloudinaryId: {
        type: String,
        required: true
    }

}, { timestamps: true })
const Video = mongoose.model("Video", VideoSchema);
export { Video }
