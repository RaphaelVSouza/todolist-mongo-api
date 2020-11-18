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

    async update(req, res) {
        const { userId } = req;
        if (!userId) {
          return res.status(401).send({ error: 'You need to be logged in' });
        }
    
        const validationSchema = Yup.object().shape({
          name: Yup.string(),
          email: Yup.string().email(),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: (oldPassword) =>
              oldPassword && oldPassword.length > 0 ? true : false,
            then: Yup.string().required(),
          }),
          confirmPassword: Yup.string().when('password', {
            is: (password) => (password && password.length > 0 ? true : false),
            then: Yup.string()
              .required()
              .oneOf([Yup.ref('password')]),
          }),
        });
    
        if (!(await validationSchema.isValid(req.body))) {
          return res.status(400).send({ message: 'Validation fails' });
        }
    
        const { email, oldPassword } = req.body;
    
        const user = await User.findById(userId);
    
        if (email && user.email !== email) {
          const userExists = await User.findOne({
            where: { email },
          });
          if (userExists) {
            return res.status(400).send({ error: 'User already exists.' });
          }
        }
     
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
          return res.status(401).send({ error: 'Password does not match.' });
        }

        
    
       
        await user.updateOne(req.body);
    
        return res.send({ message: 'Data is successfully alterated'});
      }
       
      

}

module.exports = new SessionController();