const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const { User } = require(path.resolve('models', 'models'));

module.exports = async function (req, res, next) {
  if (req.method == 'OPTIONS') next();
  let userInfo = {
    authorized: false,
    isAdmin: false,
  };
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({
      where: {
        login: decoded.login,
      },
    });
    if (!user) {
      req.body.userInfo = userInfo;
      return next();
    }
    const validPassword = bcrypt.compareSync(decoded.password, user.password);
    if (!validPassword) {
      req.body.userInfo = userInfo;
      return next();
    }
    if (decoded.login === 'admin') userInfo.isAdmin = true;
    userInfo.id = decoded.id;
    userInfo.login = decoded.login;
    userInfo.authorized = true;
  }
  req.body.userInfo = userInfo;
  return next();
};
