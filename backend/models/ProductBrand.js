import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
const brandSchema = new mongoose.Schema({
    brandName: {
        type : String
    },
    systemName: {
        type: String,
        unique: true
    },
    slug:{
        type: String
    }
})
brandSchema.plugin(URLSlugs('brandName', { field: 'slug', update: true }));
export default mongoose.model("productbrand", brandSchema);