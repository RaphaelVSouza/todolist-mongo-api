const Yup = require('yup');
const User = require('../schemas/Users');
const UserMailController = require('./UserMailController');

class UserController {
   async store (req, res) {

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required(),
        confirmPassword: Yup.string()
          .required()
          .when('password', {
            is: (password) => (password && password.length > 0 ? true : false),
            then: Yup.string().oneOf([Yup.ref('password')]),
          }),
      });
  
      if (!(await validationSchema.isValid(req.body))) {
        return res.status(400)
        .send({ message: 'Validation fails' });
      }

    const { email } = req.body;


        if (await User.findOne({ email })) {
            return res.status(400)
            .send({error: 'User already exists'})
        }
        const user = await User.create(req.body);

        const { id, name } = user;

        UserMailController.sendConfirmationMail(id, email);

        return res.json({id, name, email, token: user.generateToken({id: id})}); 
   }

   async index(req, res) {
    const users = await User.find();

    return res.json(users);
}

  
  
}


module.exports = new UserController();


