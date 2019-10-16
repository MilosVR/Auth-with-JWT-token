const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            msg:"No Token, authorization denied"
        })
    }
    //If token exists convert JWT token to a user
    try {
        const decoded = jwt.verify(token, require('../config/secret').jwtSecret)
        req.user = decoded.user;
        next()
    } catch (error) {
        res.status(401).json({msg:"Token is not valid"})
    }
}