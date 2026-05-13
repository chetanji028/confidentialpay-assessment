import mongoose from 'mongoose';
import { districts } from '../middleware/common.js';
const districtSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        enum : districts
    }
}, { timestamps: true });
export default mongoose.model('district', districtSchema);