import mongoose from "mongoose";
const Schema = mongoose.Schema;
const adminFileSchema = new mongoose.Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
    fileUri: String,
  },
  { timestamps: true }
);
export default mongoose.model("adminfile", adminFileSchema);
