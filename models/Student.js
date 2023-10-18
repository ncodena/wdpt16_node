import mongoose from "mongoose";


const StudentSchema = new mongoose.Schema({
    name: {
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
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    }
    
},  {timestamps: true} )

const Student = mongoose.model('Student', StudentSchema);

export default Student;



