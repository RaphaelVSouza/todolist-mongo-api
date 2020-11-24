import User from '../schemas/Users.js';
import UserMailController from './UserMailController.js';

class UserController {
   async store (req, res) {

    const { email } = req.body;

        if (await User.findOne({ email })) 
          return res.status(403).send({error: 'User already exists'})
        
        const user = await User.create(req.body);

        const { id, name } = user;

        UserMailController.sendConfirmationMail(id, email);

        return res.json({
          id, name, email,
          message: `A verify email is beign sent to ${email}`}); 
   }

   async update(req, res) {
    const { userId } = req.user;

        if(!userId) 
        return res.status(401).send({error: 'You must be logged in to see your projects'});
       

    const { email, oldPassword } = req.body;

    const user = await User.findById(userId);

    if (email && user.email !== email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) 
        return res.status(403).send({ error: 'User already exists.' });
    }
 
    if (oldPassword && !(await user.checkPassword(oldPassword))) 
      return res.status(401).send({ error: 'Password does not match.' });

    await user.updateOne(req.body);

    return res.send({ message: 'Data is successfully alterated'});
  }
   
}


export default new UserController();


