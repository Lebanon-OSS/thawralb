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
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array());
    }

    const { title, description, body } = req.body;

    try {

        let broadcast = await new Broadcast({
            title, description, body, users: req.user.id
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

        const broadData = await Broadcast.find().sort({ createdAt: -1 }).populate('users', 'first_name last_name username');

        if (!broadData) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'No Broadcast available' });
        }


        return res.status(httpStatus.OK).json(broadData);


    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }
});

router.put('/update', [
    authMiddleware,
    check('id', 'provide the broadcast id').not().isEmpty(),
    check('title', 'provide a title for the broadcast').not().isEmpty(),
    check('body', 'provide a body for the broadcast').not().isEmpty(),
    check('description', 'provide a desscription for the broadcast').not().isEmpty(),
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array);
    }

    const { id, title, body, description } = req.body;

    try {

        let broadcastData = { title, body, description };

        let broadcastUpdate = await Broadcast.findByIdAndUpdate(id, { $set: broadcastData });

        return res.status(httpStatus.OK).json({
            status: 'success',
            data: broadcastUpdate
        });

    } catch (error) {
        console.log(error);
        return res.statu
    }
});

router.get('/:id', [authMiddleware], async (req, res) => {

    try {

        const specificBroadcast = await Broadcast.findById(req.params.id).populate('users', 'first_name last_name username');

        if (!specificBroadcast) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: 'INVALID BROADCAST ID' });
        }

        return res.status(httpStatus.OK).json({
            status: 'success',
            data: specificBroadcast
        });


    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }
});



module.exports = router;