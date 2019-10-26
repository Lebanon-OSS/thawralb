const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const httpStatus = require('http-status-codes');

const authMiddleware = require('../../middleware/authMiddleware');

const Broadcast = require('../../models/broadcast');

router.post('/add', [
    authMiddleware,
    check('title', 'provide a title for the broadcast').not().isEmpty(),
    check('body', 'provide a body for the broadcast').not().isEmpty(),
    check('description', 'provide a description for the broadcast').not().isEmpty()
], (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array());
    }

    const { title, description, body } = req.body;

    try {

        let broadcast = await Broadcast({
            title, description, body, user: req.user.id
        });

        await broadcast.save();

        return res.status(httpStatus.OK).json({
            status: 'success',
            broadcast
        });

    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'Internal Server Error'
        });
    }


});

router.get('/all', [authMiddleware], async (req, res) => {
    try {

        const braodcast = await Broadcast.find({ createdAt: -1 });

        if (!broadcast) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'No Broadcast available' });
        }


        return res.status(httpStatus.OK).json(braodcast);


    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }
});

router.get('/update', [
    check('title', 'provide a title for the broadcast').not().isEmpty(),
    check('body', 'provide a body for the broadcast').not().isEmpty(),
    check('description', 'provide a desscription for the broadcast').not().isEmpty(),
    authMiddleware], async (req, res) => {

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json(error.array);
        }

        const { title, body, description } = req.body;

        try {
            
            
        } catch (error) {
            console.log(error);
            return res.statu
        }
    })

module.exports = router;