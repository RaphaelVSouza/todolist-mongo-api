const User = require('../schemas/Users');
const crypto = require('crypto');
const mailer = require('../../lib/mail');

class PasswordController {
    async store(req, res) {
        const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({error: 'User not found'});
        }
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }, 
        }, {useFindAndModify: false})
        
        mailer.sendMail({
            to: email,
            from: 'random@company.com.br',
            template: 'forgot_password',
            context: { token }
        })
        return res.json({message: 'Email successfully sent'})
    } catch(e) {
        res.status(400).json({error: 'Error on forgot password'})
    }


    }

    async update(req, res) {
        const { email, token, password } = req.body;

try { 
    const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires')
    if(!user) {
        res.status(400).send({ error: 'User not found'})
        
    }
    if(token != user.passwordResetToken) {
        return res.status(400).send({ error: 'Token invalid' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
        return res.status(400).json({ error: 'Token expired, generate a new one'})
    }

    user.password = password;

    await user.save();

    res.json({message: 'Password changed successfully'})
} catch(err) {
    console.log(err)
    res.status(400).json({error: 'Cannot reset password'})
}
    }
}

module.exports = new PasswordController();