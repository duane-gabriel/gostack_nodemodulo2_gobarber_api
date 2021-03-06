import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'validation failed' });
      }

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
      return res.status(500).json({ error: e.toString() });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when('oldPassword', (passOld, field) => {
            return passOld ? field.required() : field;
          }),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'validation failed' });
      }

      const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);

      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
          return res.status(400).json({ error: 'User already exists.' });
        }
      }
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const { id, name, provider } = await user.update(req.body);
      return res.send({ id, name, email, provider });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.toString() });
    }
  }
}

export default new UserController();
