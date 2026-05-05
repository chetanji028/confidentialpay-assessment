import mongoose from 'mongoose';
const Schema = mongoose.Schema
//later we have to do mapping through redis server
const socketMappingSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "admin",
    },
    socketId: String
});
export default mongoose.model('socketmapping', socketMappingSchema);