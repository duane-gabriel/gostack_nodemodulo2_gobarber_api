import User from '../models/User';
import File from '../models/Files';

class ProviderController {
  async index(req, res) {
    const users = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    return res.json(users);
  }
}

export default new ProviderController();
