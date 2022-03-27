const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

router.get('/profile/:id',catchAsync(async (req,res) => {
    const user = await User.findById(req.params.id)
    res.render('users/profile',{ user });
}))

router.put('/edit', catchAsync( async (req,res) => {
    const user = await User.findById(req.user)
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    user.location = req.body.location
    user.geometry = geoData.body.features[0].geometry;
    await user.save();
    res.redirect(`/profile/${req.user._id}`)
}))

router.route('/register')
    .get(users.renderRegister)
    .post(upload.single('image'),catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;