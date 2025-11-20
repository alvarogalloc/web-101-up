require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const mongoUrl = process.env.MONGO_URL || "";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const passportLocalMongoose = require("passport-local-mongoose");

// Definition of a schema
const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
});
userSchema.plugin(passportLocalMongoose);
userSchema.set("strictQuery", true);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ googleId: profile.id })
      .then(foundUser => {
        if (foundUser) {
          cb(null, foundUser);
        } else {
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName // Use display name as username
          });
          newUser.save()
            .then(user => cb(null, user))
            .catch(err => cb(err));
        }
      })
      .catch(err => cb(err));
  }
));

// Authentication functions
async function registerUser(req, res) {
  try {
    const newUser = new User({ username: req.body.username, email: req.body.email });
    await User.register(newUser, req.body.password);
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secrets");
    });
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
}

function loginUser(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
}

function logoutUser(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets", { supersecret: process.env.SESSION_SECRET });
  } else {
    res.redirect("/login");
  }
});

app.post("/register", registerUser);

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

app.get("/logout", logoutUser);

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/secrets");
  });

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
