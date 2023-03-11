const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const redirectToDashboard = require("./middlewares/redirectToDashboard");
const redirectToIndex = require("./middlewares/redirectToIndex");

require("dotenv").config();

const app = express();

nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/login", require(path.join(__dirname, "./routes/login")));
app.use("/logout", require(path.join(__dirname, "./routes/logout")));
app.use("/signup", require(path.join(__dirname, "./routes/signup")));
app.use("/api/notes", require(path.join(__dirname, "./routes/notes")));
app.use("/auth/google", require(path.join(__dirname, "./routes/loginWithGoogle")));
app.use("/auth/github", require(path.join(__dirname, "./routes/loginWithGithub")));
app.use("/auth/vk", require(path.join(__dirname, "./routes/loginWithVK")));


app.get("/", auth(), redirectToDashboard(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Неверный логин или пароль" : req.query.authError,
    signupError: req.query.signupError === "true" ? "Никнейм уже используется" : req.query.signupError,
    signupSuccess: req.query.signupSuccess === "true" ? "Регистрация прошла успешно" : req.query.signupSuccess,
  });
});

app.get("/dashboard", auth(), redirectToIndex(), (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

app.use("/", require("./routes/notFoundPage"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
