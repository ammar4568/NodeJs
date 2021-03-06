const express = require('express')
const authController = require('../controllers/auth')
const { check, body } = require('express-validator/check')
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.'),
    body('password', 'Please enter a password with only numbers and text and atlease 5 characters.')
        .isLength(6)
        .isAlphanumeric(),
    authController.postLogin)

router.post('/signup',
    check('email') // Check looks for the field in headers, cookies, body, param etc
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => { // Custom Validation
            // if (value == 'test@test.com') {
            //     throw new Error('This email is forbidden')
            // }
            // return true; // Else return true
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail exists already, please pick a different one')
                    }
                })
        }),
    body('password', 'Please enter a password with only numbers and text and atlease 5 characters.')
        .isLength(6)
        .isAlphanumeric(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match.')
            }
            return true;
        }),
    authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;