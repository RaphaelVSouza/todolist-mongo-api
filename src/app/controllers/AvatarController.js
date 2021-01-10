import Avatar from '../schemas/Avatar';

class AvatarController {
  async delete(req, res) {
    const { userId } = req.user;

    const avatar = await Avatar.findOne({ user_id: userId });
    if (!avatar) return res.boom.notFound('Avatar not found.');

    await avatar.remove();

    return res.json({ message: 'Avatar deleted' });
  }
}

export default new AvatarController();
