import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    }
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;