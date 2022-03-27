const express = require('express');
const router = express.Router();
const User = require("../models/user")
const Food = require('../models/food');

router.get('/', async(req,res) => {
    if(!req.user){
        req.flash('error',"User Must LOGGED IN")
        res.redirect('/login')
    } else {
        const user = await User.findById(req.user._id)
        if(user.roles === 'Admin') {
            const restaurants = await User.find({roles: 'restaurant'})
            const NGOs = await User.find({roles: 'NGO'})
            const customers = await User.find({roles: 'customer'})
            res.send({restaurants,NGOs,customers})
        } else {
            req.flash('error',"User is not Authorized")
            res.redirect('/login')
        }
    }
})

module.exports = router;