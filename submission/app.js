const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const todoRoutes = require('./api/routes/todos');

//Connecting to MongodB
mongoose.connect(
  'mongodb+srv://ShJ-dev:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-shop-ghuq1.mongodb.net/node-rest-shop?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.Promise=global.Promise;
//Handles morgan
app.use(morgan('dev'));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS error Handling before sending the routes coz we want to include these headers in all of our requests
//The asterisk used is for allowing access to all sorts of websites
app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Date,Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});

//Route which should handle requests
app.use('/todos', todoRoutes);


//Handling Error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;