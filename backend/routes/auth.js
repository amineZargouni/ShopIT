const express = require('express');
const router = express.Router();

const { registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile } = require('../controllers/authController');

    const { isAuthenticatedUser,authorizedRoles } = require('../middlewares/auth')

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser,getUserProfile);

router.route('/logout').get(logout);

module.exports = router;