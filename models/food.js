const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename:String
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    count: {
        type: Number,
        default: 0
    },
    price: {
        type:Number,
        required: true
    }
})

module.exports = mongoose.model('food', FoodSchema);