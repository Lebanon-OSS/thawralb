const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');

router.post('/uploadDoc', [authMiddleware], (req, res) => {

});

module.exports = router;