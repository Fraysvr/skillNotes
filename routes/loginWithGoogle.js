const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const flash = require("connect-flash");
const createNewUser = require("../services/createNewUser");
const createSession = require("../services/createSession");
const findUserBySocialId = require("../services/findUserBySocialId");
const { nanoid } = require("nanoid");

const router = express.Router();
router.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findUserBySocialId(profile.id);
      if (user) {
        return done(null, user);
      }
      const newUser = await createNewUser(
        profile.displayName,
        nanoid(),
        profile.provider,
        profile.id,
        profile._json.email
      );
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
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const sessionId = await createSession(req.user);
    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
  }
);

module.exports = router;
