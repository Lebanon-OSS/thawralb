const express = require('express');
const router = express.Router();

const authenticateRoute = require('./api/authentication');
const broadcastRoute = require('./api/broadcast');

// route => /api/auth
router.use('/auth', authenticateRoute);
router.use('/broadcast', broadcastRoute);

module.exports = router;