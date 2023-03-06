import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
