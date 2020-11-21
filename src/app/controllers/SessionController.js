const User = require('../schemas/Users');
const bcrypt = require('bcryptjs');

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            return res.status(400).send({error: 'User not found'});
        }

        if(!user.verifiedEmail) {
          return res.status(400)
          .send({error: 'Need to verify email first'})
        }
        
        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({error: 'Invalid password'});
        }

        const { id, name } = user;
        
        return res.json({id, name, email, token:user.generateToken({id: user.id})});
    }


}

module.exports = new SessionController();