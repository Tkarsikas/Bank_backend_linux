var express = require('express');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger.js");

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var customerRouter = require ('./routes/customer');
var cardRouter = require('./routes/card');
var accountRouter = require('./routes/account');
var loginRouter = require('./routes/login');
var card_accountRouter = require('./routes/card_account');
var transactionRouter = require('./routes/transaction');
var account_customerRouter = require('./routes/account_customer');

const authenticateToken = require('./middleware/auth');

var app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
  console.log("Swagger docs at http://localhost:3001/api-docs");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/login', loginRouter);

// Suojatut reitit
app.use(authenticateToken);
app.use('/api/customer', customerRouter);
app.use('/api/card', cardRouter);
app.use('/api/account', accountRouter);
app.use('/api/card_account', card_accountRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/account_customer', account_customerRouter);

module.exports = app;