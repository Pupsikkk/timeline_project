const path = require('path');
const ApiError = require(path.resolve('errors', 'index'));

module.exports = function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res
    .status(500)
    .json({ message: `Непредвиденная ошибка ${err.message}` });
};
