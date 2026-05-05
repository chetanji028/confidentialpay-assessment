import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const manualOrderSchema = mongoose.Schema({
    productName:{
        type: String
    },
    link:{
        type: String
    },
    description: {
        type: String
    },
    isDeleted: {
        type: Date,
        default: null
    }
}, { timestamps: true });
export default mongoose.model('manualorder', manualOrderSchema);