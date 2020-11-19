const User = require('../schemas/Users');
const crypto = require('crypto');

const Queue = require('../../lib/queue');
const ChangePassMail = require('../jobs/ChangePassMail');

const apiUrl = process.env.SERVER_URL;

class PasswordController {
    async store(req, res) {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({error: 'User not found'});
        }

        if(!user.verifiedEmail) {
            return res.status(400).send({error: 'Email must be verified first'})
        }
        
        const resetToken = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: resetToken,
                passwordResetExpires: now,
            }, 
        }, { useFindAndModify: false })

       
        await Queue.add(ChangePassMail.key, { email, apiUrl, resetToken });

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