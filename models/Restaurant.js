import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address:  {
        type: String,
        required: true
    },
    location: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        cityName: String
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    tagss: [String]
})

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

export default Restaurant;


