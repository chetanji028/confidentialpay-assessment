import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const bannerSchema = mongoose.Schema({
    bannerPhoto :{
     type:String   
    },
    link: {
        type: String
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    isDeleted: {
        type: Date,
        default: null
    },
}, { timestamps: true });
export default mongoose.model('banner', bannerSchema);