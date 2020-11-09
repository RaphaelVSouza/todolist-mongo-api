const User = require('../schemas/Users');
const bcrypt = require('bcryptjs');
const authConfig = require('../../config/auth.js');
const jwt = require('jsonwebtoken');

function generateToken(params = {}) {
    return jwt.sign( params,authConfig.secret, { expiresIn: '2d'} )
}


class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(400).json({error: 'User not found'});
        }
        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({error: 'Invalid password'});
        }
        const { id, name } = user;
        return res.json({id,name, email, token:generateToken({id: user.id})});
    }

}

module.exports = new SessionController();