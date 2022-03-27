const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required :true
    },
    image: {
        url: String,
        filename:String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    notification: [
        {
            text: {
                type: String,
                required:true
            },
            from: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            to: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            completed:{
                type:Boolean,
                default: false
            }
        }
    ],
    cart: [
        {
            food:{
                type: Schema.Types.ObjectId,
                ref: 'food'
            },
            count: {
                type:Number,
                required: true
            }
        }
    ],
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'order'
        }
    ]
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);