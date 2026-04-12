var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const { connectDB } = require('./config/database');
var authusersRouter = require('./routes/authusers');
var passwordsRouter = require('./routes/passwords');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/auth', authusersRouter);
app.use('/passwords', passwordsRouter);

connectDB();

module.exports = app;
