const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    food: [
        {
            type: Schema.Types.ObjectId,
            ref: 'food'
        }
    ],
    money: Number,
    modeOfPayment: String,
    status: {
        type: String,
        default: "Not Completed"
    },
    NGO: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    selfpickup: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('order', OrderSchema);