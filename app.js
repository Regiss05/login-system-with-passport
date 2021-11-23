const express = require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express();

mongoose.connect("mongoose://localhost:27017/node-auth-yt", {
    userNewUrlParser: true,
    userUnifiedTopology: true
});

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

app.engine('hbs', hbs({extname: '.hbs'}));
app.set('view engine', 'hbs');
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
    done(null, user.id);
});
