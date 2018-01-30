var mongoose = require('mongoose');
var config = require('../config.json');

exports.getData = function(req, res) {
    
      res.json(config.schemas);
  
  };


  exports.handlePayloads = function(req, res) {

    // get the journey number
    var journeyNumber = req.body.inArguments[0].journeyNumber;

    // connect to the DB
    mongoose.connect(config.dbUrl);
    
    // define model by journey schema number
    var journeyCollection = mongoose.model('journey' + journeyNumber, config.schemas.filter(function(schema){ return schema.journeyNumber == journeyNumber})[0].fileds);

    // get the query fileds
    var fileds = req.body.inArguments[0].fileds;
    fileds.SFID = req.body.keyValue;

    // check subscriber data by query fileds
    journeyCollection.findOne(fileds, function(err, subscriber) {

        if (err) 
            res.send(err)

        res.sendStatus(200);

        // save the recived data to data extension
        saveDataToDE();
    }); 
  };

  function saveDataToDE() {

  };