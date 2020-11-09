const User = require('../schemas/Users');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js')

function generateToken(params = {}) {
    return jwt.sign( params,authConfig.secret, { expiresIn: '2d'} )
}

class UserController {
   async store (req, res) {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({error: 'User already exists'})
        }
        const { id, name } = await User.create(req.body);

        return res.json({id, name, email, token: generateToken({id: id})});
    } catch(e) {
        console.log(e)
        return res.status(400).json({error: 'Registration failed'});
    }
        
   }
  
}


module.exports = new UserController();


