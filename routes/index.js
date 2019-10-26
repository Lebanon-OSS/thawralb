const express = require('express');
const router = express.Router();

const authenticateRoute = require('./api/authentication');
const broadcastRoute = require('./api/broadcast');
const groupRoute = require('./api/groups');

// route => /api/auth
router.use('/auth', authenticateRoute);
router.use('/broadcast', broadcastRoute);
router.use('/group', groupRoute)

module.exports = router;