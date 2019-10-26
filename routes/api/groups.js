const express = require('express');
const router = express.Router();

const Group = require('../../models/group');

const { check, validationResult } = require('express-validator');
const httpStatus = require('http-status-codes');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/all', [authMiddleware], async (req, res) => {

    try {

        const groups = await Group.find().populate('userCreated', ['first_name', 'last_name', 'username']);

        return res.status(httpStatus.OK).json({
            status: 'success',
            data: groups
        });

    } catch (error) {
        console.log(error);

        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }

});

router.post('/create', [
    authMiddleware,
    check('label', 'Provide a label for the group').not().isEmpty(),
    check('description', 'provide descripiton for the group').not().isEmpty()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array());
    }

    try {

        const { label, description, link } = req.body;

        const group = new Group({ label, description, link, userCreated: req.user.id });

        await group.save();

        return res.status(httpStatus.OK).json({
            status: 'success',
            data: group
        });

    } catch (error) {
        console.log(error);

        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INTERNAL SERVER ERROR'
        });
    }

});

router.put('/update', [
    authMiddleware,
    check('label', 'Provide a label for the group').not().isEmpty(),
    check('description', 'provide descripiton for the group').not().isEmpty()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json(error.array);
    }

    const { label, description, link } = req.body;

    try {

        let broadcastData = { label, description, link, userCreated: req.user.id };

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

router.delete('/delete/:id', async (req, res) => {
    try {
        const deleteGroup = await Group.findByIdAndDelete(req.params.id);

        if (deleteGroup) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'Success',
                data: deleteGroup
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json({
            msg: 'INVALID REQUEST'
        });
    }
});


module.exports = router;