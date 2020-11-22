import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth.js';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const jwtBodyTest = new RegExp('^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$');

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

    if(!jwtBodyTest.test(token)) {
        return res.status(401).json({error: 'Token malformed'})
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