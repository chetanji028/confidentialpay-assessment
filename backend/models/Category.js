import mongoose from "mongoose";
import URLSlugs from "mongoose-url-slugs";
const Schema = mongoose.Schema;
const categorySchema = new mongoose.Schema({
  systemName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "productbrand",
  },
  brands: [
    {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  ],
  slug: {
    type: String,
  },
  isDisabled: {
    type: Date,
    default: null,
  },
});
categorySchema.plugin(URLSlugs("displayName", { field: "slug", update: true }));
export default mongoose.model("category", categorySchema);
