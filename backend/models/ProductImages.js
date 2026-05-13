import mongoose from 'mongoose';
const Schema = mongoose.Schema
const productImageSchema = mongoose.Schema({
    thumbnail: {
        type: String
    },
    medium: {
        type: String
    },
    large: {
        type:String
    },
    productLink:{
        type: Schema.Types.ObjectId,
        ref: "product",
        default: null
    }
}, { timestamps: true });
export default mongoose.model('productimages', productImageSchema);