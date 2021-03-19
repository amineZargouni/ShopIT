const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

//register user  => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: '',
            url: ''
        }
    })
    /* const token = user.getJwtToken();
    res.status(201).json({
        success: true,

        token
    }) */
    sendToken(user, 200, res)


})






////login user  => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    //finding user in database
    //select('+password') since select = false in password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));

    }

    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));

    }

    /* const token = user.getJwtToken();
    res.status(200).json({
        success:true,
        token
    }) */
    sendToken(user, 200, res)

})






//Forgot password /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('user Not found', 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave: false
    })

    //create reset password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow : \n\n${resetUrl}`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIt password reset',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPassordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({
            validateBeforeSave: false
        });

        return next(new ErrorHandler(error.message, 500))
    }
})






//Reset password api/v1/password/reset/token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));

    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password does not match', 400));
    }

    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);
})



//logout user /api/v1/logout




exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logout successful'
    })
})


//get currently loggedin user details /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})


//update / change password =>/api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.user.id).select('+password');

    //check previous password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('old password is incorrect', 401));
    };

    user.password = req.body.password;
    await user.save();
    sendToken(user,200,res);

})


//update user profile /api/v1/me/updatePassword
exports.updateProfile = catchAsyncErrors(async (req, res, next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //update avatar TO DO

    
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message : "Profile updated"
    })

})




////////              Admin Routes ////////////

//get all users api/v1/admin/users

exports.getAllUsers = catchAsyncErrors(async (req, res, next)=>{

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})