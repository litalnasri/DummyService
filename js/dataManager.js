var mongoose = require('mongoose');
var config = require('../config.json');
var request = require('request');
mongoose.set('debug', true);
exports.getData = function(req, res) {
    
      res.json(config.journeySchemas);
  
  };


  exports.handlePayloads = function(req, res) {
      console.log("execute");
      var isSentRes = false;

      console.log(req.body);
    // get the journey number
    var journeyNumber = req.body.inArguments[0].journeyNumber;

    // connect to the DB
    mongoose.connect(config.dbUrl);
    
    var journeyCollection;

    // define model by journey schema number if doesnt exist
    if(!mongoose.models['journey' + journeyNumber])
    {
        journeyCollection = mongoose.model('journey' + journeyNumber, config.journeySchemas.filter(function(schema){ return schema.journeyNumber == journeyNumber})[0].fields);
    }
    else {
        journeyCollection = mongoose.models['journey' + journeyNumber];
    }

    // get the query fields
    var fields = req.body.inArguments[0].fields;
    fields.SFID = req.body.keyValue;

    // check subscriber data by query fields
    journeyCollection.findOne(fields, function(err, subscriber) {
        
        // ** timeout case simulation **
        setTimeout(function(subscriber) {
        console.log("query resault: " + subscriber)

        // if already sent MC response (timeout occurred)
        if (isSentRes && subscriber) {

            // save the recived data to data extension
            saveDataToDE(subscriber._doc);
        }
        else if (subscriber) {
           
            // save the recived data to data extension
            saveDataToDE(subscriber._doc);

            // ** For CA without split **
            // res.sendStatus(200);

            // ** For CA with split **
            res.send({"branchResult": "valid_path"});
            isSentRes = true;
        }
        else if (!isSentRes && !subscriber) {
            console.log("error: " + err)

            // ** For CA without split **
            // res.status(404).send('Not found');

            // ** For CA with split **
            res.send({"branchResult": "not_valid_path"});
            isSentRes = true;
        } 
    }, 6000, subscriber);
    }); 

    // handle timeout
    setTimeout(function(res) {

        // if response hasn't sent to marketing cloud yet - sends OK status while the proccess of the function works
        if (!isSentRes) {
            res.send({"branchResult": "valid_path"});
            isSentRes = true;
        }
    }, 2900, res)
  };

  exports.handlePublish = function(req, res) {
    console.log("publish");
    res.sendStatus(200);
  }

  exports.isValid = function(req, res) {
    console.log("isValid");
    console.log(req.body);
    res.sendStatus(200);
  }
  
  function saveDataToDE(subscriber) {

    var deName;
    var token;
    var configCollection;
    
    if(!mongoose.models['config1'])
    {
        configCollection = mongoose.model('config1', config.configSchema);
    }
    else {
        configCollection = mongoose.models['config1'];
    }

    configCollection.find({}, function(err,doc){
        deName = doc[0].dataExtensionName;
        token = doc[0].token;

        var key = subscriber.SFID;
        delete subscriber['_id'];
        delete subscriber['SFID'];

        var values = subscriber;
 
        request.post({
        headers: {'Authorization' : `Bearer ${token}`, 'Content-Type' : 'application/json'},
        url:     `https://www.exacttargetapis.com/hub/v1/dataevents/key:${deName}/rowset`,
        json: true,
        body: [
            {
                "keys": { "SFID": key},
                "values": values
            }
        ]
        }, function(error, response, body){
        console.log(body);
        });
    });   
  };