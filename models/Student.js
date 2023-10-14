import mongoose from "mongoose";
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim: true
    },
    first_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email required"],
        minlength: 1,
        maxlength: 100,
        unique: true,
        trim: true,
        // validate: {
        //     validator: email => emailRegex.test(email),
        //     message: props => `${props.value} is not a valid email address!`
        // },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    tokenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }
})

const Student = mongoose.model('Student', StudentSchema);

export default Student;



