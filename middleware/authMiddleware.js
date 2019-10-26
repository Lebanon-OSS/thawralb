const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
    // get the token from the header
    let token = req.header('x-auth-header') || req.header['authorization'];

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'unauthorized' });
    }

    if (token.startWith('Bearer')) {
        token = token.slice(7, token.length).trimLeft();
    }

    // Verify Token

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = decoded.user;
        next();

    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'unauthorized' });
    }
}