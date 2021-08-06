class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static BadRequest(message) {
    return new ApiError(400, message);
  }

  static internal(message) {
    return new ApiError(500, 'Непредвиденная ошибка: ' + message);
  }

  static dbError(message) {
    return new ApiError(500, `DBerror: ${message}`);
  }

  static nonAuth() {
    return new ApiError(401, 'Не авторизован!');
  }
}

module.exports = ApiError;
