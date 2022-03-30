const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortalSchema = new Schema({
    start:{
        type : String
    },
    end:{
        type : String
    }
})

module.exports = mongoose.model('portal', PortalSchema);