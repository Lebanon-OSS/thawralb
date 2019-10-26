const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const httpStatus = require('http-status-codes');
const User = require('../../models/users');
const authMiddleware = require('../../middleware/authMiddleware');
const errorResponse = require('../../helpers/errorResponse');


router.post('/signup', [
    check('email', 'Provide with email Addresss').not().isEmpty(),
    check('username', 'Provide with valid username').not().isEmpty(),
    check('password', 'Provide with valid password').not().isEmpty(),
], async (req, res) => {
    // check if it passsed the validation params
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(errors.array());
    }

    let { first_name, last_name, role, email, username, password } = req.body;

    try {
        // check if there is a user with already same email or username 
        let user = await User.findOne({ $or: [{ email: email }, { username: username }] });

        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                msg: 'User already exists'
            });
        }

        // generate salt to encrypt
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // generate a new user to push it to db
        user = new User({
            first_name,
            last_name,
            email,
            role,
            username,
            password
        });

        await user.save();

        // generate a payload to put it in the token
        const payload = {
            user: {
                id: user.id
            }
        };

        // generate a token and return it to the user
        jwt.sign(payload, process.env.jwt_secret, { expiresIn: '24h' }, (error, token) => {
            if (error) throw error;

            return res.status(httpStatus.OK).json({
                user,
                token
            });
        })



    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL_SERVER_ERROR'
        });
    }

});

router.post('/login', [
    check('login', 'Provide with a username or email address').not().isEmpty(),
    check('password', 'Provide with password to validate').not().isEmpty(),
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(errors.array())
    }

    const { login, password } = req.body;

    try {
        // find if there is a matching username or email
        let user = await User.findOne({ $or: [{ email: login }, { username: login }] });

        if (!user) {

            return res.status(httpStatus.BAD_REQUEST).json(errorResponse('Invalid User'));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(httpStatus.BAD_REQUEST).json(errorResponse('invalid credentials'));
        }

        // generate a token and login
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = await jwt.sign(payload, process.env.jwt_secret, { expiresIn: '24h' });

        return res.status(httpStatus.OK).json({
            status: 'success',
            data: {
                token
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL_SERVER_ERROR'
        });
    }
});

router.post('/forgotPassword', [
    check('login', 'Provide a valid username or email')
], async (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array());
    }

    try {

        const { login } = req.body;

        const user = await User.findOne({ $or: [{ email: login, username: login }] });

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Invalid User' })
        }

        //todo: send email with a template with a specific token to validate


    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }

});

router.post('/changePassword', authMiddleware, [
    check('password', 'Provide a valid password'),
], async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array());
    }

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'Invalid Credentials' });
        }

        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(password, salt);

        // only update password
        user = await User.findByIdAndUpdate(id, { $set: { password: password } });

        return res.status(httpStatus.OK).json({
            status: 'success',
            msg: 'User has been successfully changed his password'
        });


    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }
});


module.exports = router;