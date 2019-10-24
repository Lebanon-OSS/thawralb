const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const httpStatus = require('http-status-codes');
const User = require('../../models/users');

router.post('/signup', [
    check('email', 'Provide with email Addresss'),
    check('username', 'Provide with valid username'),
    check('password', 'Provide with valid password'),
], async(req, res) => {
    // check if it passsed the validation params
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(errors.array());
    }

    const { first_name, last_name, email, username, password } = req.body;

    try {
        // check if there is a user with already same email or username 
        let user = User.findOne({ email: email, username: username });

        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                msg: 'User already exists'
            });
        }

        // generate salt to encrypt
        const salt = bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // generate a new user to push it to db
        user = new User({
            first_name,
            last_name,
            email,
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
        jwt.sign(payload, process.env.jwtSecret, { expiresIn: '24h' }, (error, token) => {
            if (error) throw error;

            return res.status(httpStatus.OK).json({
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

module.exports = router;