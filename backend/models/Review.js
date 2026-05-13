import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const reviewSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    comment: {
        type: String
    },
    star: {
        type: Number,
        max:5
    }
}, { timestamps: true });
export default mongoose.model('reviews', reviewSchema);