import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
})

const Film = mongoose.model('Film', FilmSchema);

export default Film;



