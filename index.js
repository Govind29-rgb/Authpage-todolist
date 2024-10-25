const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "randomkuchbhi";
app.use(express.json());
const users = [];

app.post("/signup", function (req, res) {
  const { username, password } = req.body;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    msg: "User signed up successfully",
  });
});

function auth(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const finduser = users.find(function (u) {
    return u.username === username && u.password === password;
  });
  if (finduser) {
    req.username = username;
    next();
  } else {
    res.status(401).json({
      msg: "User not found or invalid credentials",
    });
  }
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signin", auth, function (req, res) {
  const username = req.username;
  const token = jwt.sign(
    {
      username: username,
    },
    JWT_SECRET
  );
  res.send({
    username,
    token: token,
  });
});

app.get("/me", function (req, res) {
  const token = req.headers.token;
  if (!token) {
    res.json({
      msg: "No token supplied!",
    });
  }
  const decode = jwt.verify(token, JWT_SECRET);
  const username = decode.username;

  const finduser = users.find(function (u) {
    return u.username === username;
  });

  if (finduser) {
    res.json({
      username: username,
      password: finduser.password,
    });
  } else {
    res.json({
      msg: "user not found in the db",
    });
  }
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
