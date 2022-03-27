const express = require('express');
const router = express.Router();
const User = require("../models/user")
const Food = require('../models/food');

router.get('/', async(req,res) => {
    if(!req.user) {
        req.flash('error',"User Must LOGGED IN")
        res.redirect('/login')
    }
    else {
        const user = await User.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'food',
                populate: {
                    path: 'restaurant'
                }
            }
        })
        const cart = user.cart
        var money = 0
        for(let i in cart){
           money += cart[i].count*cart[i].food.price
        }
        res.render('cart/index',{ cart, money })
    }
})

router.put('/:foodid', async(req,res) => {
    const { count } = req.body
    if(!req.user)
        req.flash('error',"User Must LOGGED IN")
    else {
        const food = await Food.findById(req.params.foodid)
        const user = await User.findById(req.user._id)
        const index = user.cart.findIndex((element) => {
            return element.food.equals(req.params.foodid)
        })
        if(index === -1)
            req.flash('error',"Something Went Wrong")
        else {
            const diff = req.body.count - user.cart[index].count
            user.cart[index].count += parseInt(diff)
            food.count = food.count - diff
            await food.save();
            await user.save();
        }
        res.redirect('/cart')
    }
})

router.delete('/:foodid', async(req,res) => {

    if(!req.user)
        req.flash('error',"User Must LOGGED IN")
    else {
        const food = await Food.findById(req.params.foodid)
        const user = await User.findById(req.user._id)
        const index = user.cart.findIndex((element) => {
            return element.food.equals(req.params.foodid)
        })
        if(index === -1)
            req.flash('error',"Something Went Wrong")
        else {
            food.count = food.count + user.cart[index].count
            const cart = user.cart.filter(c => {
                if(!c.food.equals(req.params.foodid))
                    return c
            })
            user.cart = cart
            await food.save();
            await user.save();
        }
        res.redirect('/cart')
    }
})

module.exports = router;