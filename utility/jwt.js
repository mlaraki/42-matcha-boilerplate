let jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (email) => {
    let token = jwt.sign({ email: email }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });
    return token;
  };
  
const generateRefreshToken = (email) => {
    let token = jwt.sign({ email: email }, process.env.JWT_REFRESH_KEY);
    return token;
  };

  module.exports = {
      generateToken,
      generateRefreshToken,
  }