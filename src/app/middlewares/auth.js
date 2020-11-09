const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({error: 'Token not provided'})
    }
    const parts = authHeader.split(' ');

    if(!parts.length == 2) {
        return res.status(401).json({error: 'Token error'})
    }

    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({error: 'Token syntax error'})
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Token invalid'})
        }

        req.userId = decoded.id;
        return next();
    })


}