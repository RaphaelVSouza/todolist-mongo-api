const crypto = require('crypto');
const Mail = require('../../lib/mail');
const User = require('../schemas/Users');
const apiUrl = process.env.BACK_URL;

class UserMailController {

    async sendConfirmationMail(id, email) {
        const verifyToken = crypto.randomBytes(20).toString('hex');
        
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(id, {
          '$set': {
              verifyEmailToken: verifyToken,
              verifyEmailExpires: now,
          }, 
      }, {useFindAndModify: false})

        await Mail.sendMail({
          to: email,
          from: 'random@company.com.br',
          subject: 'Email confirmation',
          template: 'email_confirmation',
          context: { verifyToken, apiUrl }
        })

    }
    
    async verifyEmail(req, res) {
        const token = req.params.verifyToken;
    
        const user = await User.findOne({ verifyEmailToken: token })
        .select('+verifyEmailToken +verifyEmailExpires');

        if(!user) {
           return res.status(400)
           .send({ error: 'User not found'})
       
        }

        if(user.verifiedEmail === true) {
            return res.status(400)
            .send({ error: 'Email is already verified'})
        }
    
        if(token != user.verifyEmailToken) {
          return res.status(400)
          .send({ error: 'Token invalid' });
      }
    
      const now = new Date();
    
      if (now > user.verifyEmailExpires) {
          return res.status(400)
          .send({ error: 'Token expired, generate a new one'})
      }
    
      user.verifiedEmail = true;
      user.save();
    
     return res.json({message: 'Email verified successfully'});
      }
       
}

module.exports = new UserMailController();