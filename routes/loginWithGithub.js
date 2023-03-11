const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const flash = require("connect-flash");
const createNewUser = require("../services/createNewUser");
const createSession = require("../services/createSession");
const findUserBySocialId = require("../services/findUserBySocialId");
const { nanoid } = require("nanoid");

const router = express.Router();
router.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.get("/", passport.authenticate("github"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://skill-notes.vercel.app/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findUserBySocialId(profile.id);
      if (user) {
        return done(null, user);
      }
      const newUser = await createNewUser(profile.username, nanoid(), profile.provider, profile.id);
      return done(null, newUser);
    }
  )
);

passport.serializeUser(async (user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Найти пользователя в базе данных по его id
  done(null, id);
});

router.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const sessionId = await createSession(req.user);
    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
  }
);

module.exports = router;
