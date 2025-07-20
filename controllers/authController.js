const crypto = require('crypto');
const User = require('../models/User')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlware/async");

//@desc    Register user
//@route   POST /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async(req, res, next)=>{
    const {name, email, password} =req.body
    const userExists=await User.findOne({email})
    if(userExists){
    return next(new ErrorResponse(`User already exists`, 400))
    }
    const user = await User.create({name, email, password})

    // Create Token and retun token
    // this method getSignedJwtToken create on user schema that is static method 
    const token = user.getSignedJwtToken();
    res.status(200).json({success: true, token})
  
})

//@desc    Register user
//@route   POST /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async(req, res, next)=>{
    const {email, password} =req.body
    //valid email and password
    if(!email ||!password){
        return next(new ErrorResponse(`Please provide an email and password`, 400))
    }
    //check for user
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }
    //check if password matches
    const isMatch = await user.matchPassword(password)
    if(!isMatch){
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }
    //getSignedJwtToken static method  Create Token and return token as response
    const token = user.getSignedJwtToken();
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
    res.status(200).json({success: true, token, user:userData})

})
