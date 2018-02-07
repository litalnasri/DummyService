var mongoose = require('mongoose');
var config = require('../config.json');

exports.getData = function(req, res) {
    
      res.json(config.schemas);
  
  };


  exports.handlePayloads = function(req, res) {
      console.log("execute");

    // get the journey number
    var journeyNumber = req.body.inArguments[0].journeyNumber;

    // connect to the DB
    mongoose.connect(config.dbUrl);
    
    var journeyCollection;

    // define model by journey schema number if doesnt exist
    if(!mongoose.models['journey' + journeyNumber])
    {
        journeyCollection = mongoose.model('journey' + journeyNumber, config.schemas.filter(function(schema){ return schema.journeyNumber == journeyNumber})[0].fields);
    }
    else {
        journeyCollection = mongoose.models['journey' + journeyNumber];
    }

    // get the query fields
    var fields = req.body.inArguments[0].fields;
    fields.SFID = req.body.keyValue;

    // check subscriber data by query fields
    journeyCollection.findOne(fields, function(err, subscriber) {

        console.log("query resault: " + subscriber)
        if (subscriber) {

            // save the recived data to data extension
            saveDataToDE();

            res.sendStatus(200);
        }
        else {
            console.log("error: " + err)
            res.status(404).send('Not found');
        } 
    }); 
  };

  exports.handlePublish = function(req, res) {
    console.log("publish");
    res.sendStatus(200);
  }
  
  function saveDataToDE() {

  };