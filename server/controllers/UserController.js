const path = require('path');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User } = require(path.resolve('models', 'models'));
const ApiError = require(path.resolve('errors', 'index'));

function generateAccessToken(id, login, password) {
  const payload = {
    id,
    login,
    password,
  };
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '24h' });
}

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({ message: 'Ошибка при регистрации', errors });
      const { login, password } = req.body;
      const candidate = await User.findOne({ where: { login: login } });
      if (candidate) {
        return next(ApiError.dbError('Такой пользователь уже существует!'));
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await User.create({ login, password: hashPassword });
      const token = generateAccessToken(user.id, login, password);
      return res.status(200).json({ token: token });
    } catch (e) {
      return next(ApiError.internal(err.message));
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ where: { login: login } });
      if (!user) {
        return next(ApiError.BadRequest('Такого пользователя не существует!'));
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return next(ApiError.BadRequest('Неверный пароль!'));
      }
      const token = generateAccessToken(user.id, login, password);
      return res.status(200).json({ token: token });
    } catch (err) {
      return next(ApiError.internal(err.message));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ where: { login: login } });
      if (!user || !(user.dataValues.login === login))
        return next(ApiError.BadRequest('Неверный логин!'));
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return next(ApiError.BadRequest('Неверный пароль!'));
      }
      await user.destroy();
      return res.status(300).redirect('/');
    } catch (err) {
      return next(ApiError.internal(err.message));
    }
  }
}

module.exports = new UserController();
