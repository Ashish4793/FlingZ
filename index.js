require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const User = require("./models/userSchema")
const port = 8000
const userRouter = require("./routes/userRoutes");

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    },
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.set("strictQuery", false);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/google/callback'
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id , email : profile.emails[0].value }, function (err, user) {
            return cb(err, user);
          });
    }
));



app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'], prompt: 'select_account' }));


app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

 
  app.use("/user", userRouter);



  mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    try {
      console.log("DataBase connected successfully")
      app.listen(port, () => {
          console.log(`Server connected to http://localhost:${port}`)
      })
  } catch (error) {
      console.log('Cannot start the server')
  }
  }).catch(error => {
    console.log('invalid database connection')
})


