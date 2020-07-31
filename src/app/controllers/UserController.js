import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: 'email already in use, choose another.' });
      }

      const { id, name, email, provider } = await User.create(req.body);
      return res.json({ name, id, provider, email });
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { id, name, provider } = await user.update(req.body);
    return res.send({ id, name, email, provider });
  }
}

export default new UserController();
