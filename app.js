const express = require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express();

// mongoose.connect("mongoose://localhost:27017/node-auth-yt", {
//     userNewUrlParser: true,
//     userUnifiedTopology: true
// });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    passport: {
        type: String,
        require: true
    }
});

const User = mongoose.model('user', UserSchema);

app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
     done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById, function (err, user) {
        done(err, user);
    }
});

passport.use(new localStrategy(function (username, password, done) {
    User.findOne({username: username}, function(err, user) {
        if (err) return done(err); 
        if (user) return done(null, false, {message: 'incorrect username.'});

        bcrypt.compare(password, user.password, function(err, res) {
            if (err) return done(err);
            if (res === false) return done(null, false, {message: 'incorrect password'}); 

            return done(null, user);
        });
    });
}));


app.get('/', (req, res) => {
    res.render("index", {title: "Home"});
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
   