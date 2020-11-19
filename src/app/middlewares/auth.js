const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({error: 'Token not provided'})
    }
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
        return res.status(401).json({error: 'Token type must be "Bearer"'})
    }

    if(!token) {
        return res.status(401).json({error: 'Token must be passed'})
    }
 
    jwt.verify(token, authConfig.secret, {
        expiresIn: authConfig.expires
    }, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Token invalid'})
        }

        req.userId = decoded.id;
        return next();
    })


}