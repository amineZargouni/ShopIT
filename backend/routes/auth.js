const express = require('express');
const router = express.Router();

const { registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    getAllUsers,
    getUserDetails,
    updateUser,
    deleteUser } = require('../controllers/authController');

const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth')

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);


//admin routes 

router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizedRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizedRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser);




module.exports = router;