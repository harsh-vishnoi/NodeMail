const express = require('express');
// Express used to create server
const app = express();

const session = require('express-session');
var auth = require('./auth.js');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }
));

// Update client_secret with the credentials download from developers.google

app.get('/', function(req, res) {
  res.send('Route to "/sendMail" to send mail');
});

app.get('/sendMail', function(req, res) {
  auth.sendMail();
});

app.get('/createDraft', function(req, res) {
  auth.saveDraft();
});

app.listen(process.env.PORT || 4000 , () => {
  console.log('Listening ... ')
});
