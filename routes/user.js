require('dotenv').config();
const express = require('express')
const Router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const rateLimit = require("express-rate-limit");

// Define rate limiting rules
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 3, // Limit each IP to 100 requests per window
message: "Too many requests from this IP, please try again later.",
standardHeaders: true, // Include rate limit info in response headers
legacyHeaders: false, // Disable `X-RateLimit-*` headers
});



const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})



Router.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.find({ email: req.body.email })
        if (existingUser.length > 0) {
            return res.status(409).json({
                error: 'email already registered...'
            })
        }

        // const uploadImage = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
        //     resource_type: 'image',
        //     folder: "UserImage"
        // })
        const hash = await bcrypt.hash(req.body.password, 10)

        const newUser = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hash,
            phone: req.body.phone,
            // imageUrl: uploadImage.secure_url,
            // imageId: uploadImage.public_id
        })


        if(req.files){
            const uploadImage = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            resource_type: 'image',
            folder: "UserImage"

        })
        newUser.imageUrl=uploadImage.secure_url,
        newUser.imageId=uploadImage.public_id
        }



        const result = await newUser.save()
        res.status(200).json({
            msg: 'account created',
            newUser: result
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

Router.post('/login',limiter, async (req, res) => {
    try {


        //Verify email
        const existingUser = await User.find({ email: req.body.email })
        if (existingUser.length == 0) {
            return res.status(500).json({ message: "Email not registered...." })
        }

        //verify password
        const isMatch = await bcrypt.compare(req.body.password, existingUser[0].password)
        if (!isMatch) {
            return res.status(500).json({ message: "invalid password!" })
        }

        //After verifying email and password ...next step is to provide token
        const token = await jwt.sign({
            email: existingUser[0].email,
            fullname: existingUser[0].fullname,
            userId: existingUser[0]._id
        },
            process.env.SEC_KEY,
            { expiresIn: '4d' }
        )

        res.status(200).json({ token: token })

        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        console.log("TokenData : ", tokenData);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })

    }
})


module.exports = Router