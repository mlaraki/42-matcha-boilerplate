const { client } = require("../db/client");
const bcrypt = require("bcrypt");
const {generateToken , generateRefreshToken} = require("../utility/jwt")

require("dotenv").config();

const validatePassword = async (password, hashedPassword) => {
  let result = await bcrypt.compare(password, hashedPassword);
  return result;
};

const validInput = async (username, password) => {
  let userRegex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/g;
  let passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;
  if (username.match(userRegex) == null || password.match(passRegex) == null)
    return false;
  try {
    let response = await client.query(
      "SELECT password FROM users WHERE username = $1",
      [username]
    );
    return response.rowCount
      ? validatePassword(password, response.rows[0].password)
      : false;
  } catch (err) {
    return false;
  }
};


const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return next(new Error("invalid username or password"));
    let isValid = await validInput(username, password);
    if (!isValid) return next(new Error("invalid username or password"));
    else {
      let token = generateToken(username);
      let refreshToken = generateRefreshToken(username);
      //store every refresh token in the database

      res
        .status(200)
        .json({
          error: false,
          message: "Authentication successful",
          token: token,
          refreshToken: refreshToken,
        });
    }
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  const { username, firstname, lastname, email, password, created_at } = req.body;
  let valid = false;
  try {
    let salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(password, salt);
    let response = await client.query(
      "INSERT INTO users (username , firstname, lastname, email, password, created_at, valid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING (id) ",
      [username, firstname, lastname, email, hashedPassword, Number(created_at), valid]
    );
   res.status(200).json({error: false,  id: Number(`${response.rows[0].id}`)});
  } catch (err) {
    next(err);
  }
};


module.exports = {
  login,
  register
};
