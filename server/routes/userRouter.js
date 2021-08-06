const Router = require('express');
const router = new Router();
const path = require('path');
const { check } = require('express-validator');
const UserController = require(path.resolve('controllers', 'UserController'));
const AuthMiddleware = require(path.resolve('middleware', 'authHandler'));

router.post(
  '/registration',
  [
    check('login', 'Имя пользователя не может быть пустым!').notEmpty(),
    check(
      'password',
      'Пароль должен состоять минимум из 8ми символов но не более 16ти!'
    ).isLength({
      min: 8,
      max: 16,
    }),
  ],
  UserController.registration
);
router.post('/login', UserController.login);
router.delete('/deleteUser', AuthMiddleware, UserController.deleteUser);

module.exports = router;
