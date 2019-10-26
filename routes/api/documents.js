const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');

router.post('/uploadDoc', [authMiddleware], async (req, res) => {

});

router.post('/uploadCarousel', [authMiddleware], async (req, res) => {
    
})

module.exports = router;