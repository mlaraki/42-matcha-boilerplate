const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.argv[2] || 3000;

const users = require("./routes/users");
const auth = require("./routes/auth");
const tokens = require("./routes/tokens");

app.use(
  cors(),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the matcha api");
});

app.use("/auth", auth);
app.use("/tokens", tokens);
app.use("/users", validateToken, users);


async function validateToken(req, res, next) {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if(!token) return next(new Error("Missing token"));
    token.startsWith("Bearer ")
      ? (token = token.slice(7, token.length))
      : next(new Error("Invalid Token"));
    let decoded = await jwt.verify(token, process.env.JWT_KEY);
    req.decoded = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

//error handler
app.use(function(error, req, res, next) {
  console.error("\x1b[31m", error.message, "\x1b[2m", error, "\x1b[0m");
  res.status(403).json({ error: true, message: error.message });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

module.exports = app;
