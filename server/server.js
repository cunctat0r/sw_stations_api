require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var  mongoose = require('./db/mongoose');
var {Station} = require('./models/station');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/stations', (req, res) => {
  Station.find().then((stations) => {
    res.send({stations});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/stations', (req, res) => {
  var station = new Station({
    name: req.body.name,
    freq: req.body.freq
  });
  station.save().then((doc) => {
      res.send(doc);
    }, (e) => {
    res.status(400).send(e.message);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
