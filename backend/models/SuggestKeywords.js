import mongoose from 'mongoose';
const suggestKeywordSchema = mongoose.Schema({
    keyword: {
        type: String,
        unique: true
    },
    isDeleted: {
        type: Date,
        default: null
    }
}, { timestamps: true });
export default mongoose.model('suggestkeyword', suggestKeywordSchema);