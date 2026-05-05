import mongoose from "mongoose";
const Schema = mongoose.Schema
const bankSchema = new mongoose.Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: "admin",
        required: true
    },
    accountHolder: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    bankName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    branchName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    accountNumber: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    routingNumber: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    chequeCopy: {
        type: Schema.Types.ObjectId,
        ref: "adminfile",
    },
    isVerified: {
        type: Date,//as we may need verified date
        default: null
    }
}, { timestamps: true });

export default mongoose.model("adminbank", bankSchema);