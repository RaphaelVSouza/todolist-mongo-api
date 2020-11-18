const User = require('../schemas/Users');
const crypto = require('crypto');
const Mail = require('../../lib/mail');

const apiUrl = process.env.BACK_URL;

class PasswordController {
    async store(req, res) {
        const { email } = req.body;

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
        }, { useFindAndModify: false })

        await Mail.sendMail({
            to: email,
            from: 'random@company.com.br',
            subject: 'Change password',
            template: 'forgot_password',
            context: { token, apiUrl } 
          });
    
        return res.json({message: 'Email successfully sent'})

    }

    async update(req, res) {
        const { email, password } = req.body;
        const { resetToken } = req.params;


    const user = await User.findOne({ email })
    .select('+passwordResetToken +passwordResetExpires');

    if(!user) {
       return res.status(400)
       .send({ error: 'User not found'})
        
    }
    if(resetToken != user.passwordResetToken) {
        return res.status(400)
        .send({ error: 'Token invalid' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
        return res.status(400)
        .json({ error: 'Token expired, generate a new one'});
    }

    user.password = password;

    await user.save();

   return res.json({message: 'Password changed successfully'});

    }
}

module.exports = new PasswordController();