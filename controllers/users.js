const User = require('../models/user');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {    
    try {
        const { email, username, password,option,location } = req.body;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const user = new User({ email,roles:option,location, username });
        user.geometry = geoData.body.features[0].geometry;
        if(req.file){
            user.image = {
            url: req.file.path,
                filename: req.file.filename
            }
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to NPO!');
            res.redirect('/restaurants');
        })
    } catch (e) {
        if (e.name === 'MongoServerError' && e.code === 11000) {
            e.message = 'Email must be unique'
        }
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/restaurants';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}


// /                                Home                            Done
// /register                        Register Route                  Done
// /login                           Login Route                     Done
// /logout                          logout Route                    Done
// /profile/:id                     profile Route                   Done
// /restaurants                     All Restaurants                 Done
// /restaurants/:id                 Particular Restaurants          Done
// /restaurants/:id/add             Add Food by restaurants         Done
// /restaurants/:id/:foodid/edit    Edit Food by res                Done
// /restaurants/:foodid/add         Add Food to Cart                Done
// /cart                            Cart Route                      Done
// /cart/:foodid/edit               Edit Count to Order             Done
// /cart/donation                   Donation to NGO                 Not
// /cart/selfpick                   SelfPick                        Not
// /cart/pay/cod                    Cash-On Delivery                Not
// /cart/pay/online                 Online Payment                  Not
// /notification                    Notification Route              Not