const sendResponse = (res, messageObj, data = null) => {
  const response = {
    success: messageObj.status < 400,
    message: messageObj.message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(messageObj.status).json(response);
};

const sendError = (res, messageObj, errors = null) => {
  const response = {
    success: false,
    message: messageObj.message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(messageObj.status).json(response);
};

const verifyEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  sendResponse,
  sendError,
  verifyEmail,
};
