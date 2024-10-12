const jwt = require("jsonwebtoken");

const generateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

const decodeJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = { generateJwtToken, decodeJwtToken };
