const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../../config/auth.js');

module.exports = async (req, res, next) => {
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
 
    try {

        const decoded = await promisify(jwt.verify)(token, authConfig.secret, {
            expiresIn: authConfig.expires
        })

        req.userId = decoded.id;

        return next();

    } catch(err) {
        console.log(err);
        return res.status(401).json({error: 'Token invalid'})
    }


}