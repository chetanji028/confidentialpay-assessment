import mongoose from 'mongoose';
const leadSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    isDeleted: {
        type: Date,
        default: null
    }
}, { timestamps: true });
export default mongoose.model('lead', leadSchema);