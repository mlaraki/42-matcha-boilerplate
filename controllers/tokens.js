const { client } = require("../db/client");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utility/jwt");

const isRevoked = async (refreshToken) => {
    try {
      let result = await client.query(
        "select * from refreshtokens where tokens @> $1",
        [`{${refreshToken}}`]
      );
      return result.rowCount ? true : false;
    } catch (error) {
      return true;
    }
  };
  
  const refreshToken = async (req, res, next) => {
    let { refreshToken } = req.body;
    try {
      let decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
      let isInvalid = await isRevoked(refreshToken);
      if (isInvalid) return next(new Error("Token is revoked"));
      let token = generateToken(decoded.email);
      res
        .status(200)
        .json({
          error : false,
          message: "Authentication successful",
          token: token,
          refreshToken: refreshToken,
        });
    } catch (err) {
      next(err);
    }
  };
  
  const revokeToken = async (req, res, next) => {
    try {
      let { refreshToken } = req.body;
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
      let result = await client.query("select * from refreshtokens where tokens @> $1", [`{${refreshToken}}`]);
      if(result.rowCount) res.status(200).json({ message: "Token already revoked" });
      else {
        await client.query("update refreshtokens set tokens = array_append(tokens, $1)", [refreshToken]);
        res.status(200).json({ message: "Token revoked" });
      }
    } catch (err) {
      next(err);
    }
  };

  const validateToken = async (req, res, next) => {
    try {
      let { token } = req.body;
      jwt.verify(token, process.env.JWT_KEY);
      res.status(200).json({error: false, message: "Valid token"});
    } catch (err) {
      res.status(403).json({error: true, message : err.message});
    }
  }

  module.exports = {
    refreshToken,
    revokeToken,
    validateToken
  };
  