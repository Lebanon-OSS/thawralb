const express = require('express');
const router = express.Router();

const authenticateRoute = require('./api/authentication');

// route => /api/auth
router.use('/auth', authenticateRoute);

module.exports = router;