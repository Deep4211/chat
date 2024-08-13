const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const session = require('express-session');
const { handleErrors } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    } else {
        res.redirect('/auth/login');
    }
});

app.use(handleErrors);

module.exports = app;
