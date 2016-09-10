var express = require('express');
var router = express.Router();
var PokemonGO = require('../poke.io.js');
var PokeTrainer = require('../models/poketrainer');

var a = new PokemonGO.Pokeio();


var saveProfile = function(profile, currentLocation, res){
  console.log("Save profile called");
  var position = {type: "Point", coordinates: [currentLocation.coords.longitude,currentLocation.coords.latitude]}; //longitude need to come first!
  res.setHeader('Content-Type', 'application/json');
  var trainer = new PokeTrainer({username: profile.username, location: position});
  //Save Profile to DB if it doesn't exist
  PokeTrainer.find({username: profile.username }, function(err,trainers){
      console.log(trainers);
      if(err){
        res.send(JSON.stringify({ status: "fail", error: err }));
      }
      else{
        //USer doesn't exist. Create the user.
        if(trainers.length == 0){
          //save into DB
            trainer.save(function(err){
              if(err)
                res.send(JSON.stringify({ status: "fail", error: err }));
              else
                res.send(JSON.stringify({ status: "success", profile: trainer}));
            });
        }

        //Default operation. Find user and update location
        PokeTrainer.findOneAndUpdate({ username: profile.username }, {location: position} , function(err, trainer) {
        if (err) {
          res.send(JSON.stringify({ status: "fail", error: err }));
        }
        else{
          res.send(JSON.stringify({ status: "success", profile: trainer}));
        }

      }
  });
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  //Initiate Pokemon stuff
  a.init(req.body.username, req.body.password, req.body.position, "ptc", function(err) {
    if (err) throw err;

    console.log('1[i] Current location: ' + a.playerInfo.locationName);
    console.log('1[i] lat/long/alt: : ' + a.playerInfo.latitude + ' ' + a.playerInfo.longitude + ' ' + a.playerInfo.altitude);

    a.GetProfile(function(err, profile) {
        if (err) throw err;
        console.log('1[i] Username: ' + profile);
        console.log('1[i] Username: ' + profile.username);
        console.log('1[i] Poke Storage: ' + profile.poke_storage);
        console.log('1[i] Item Storage: ' + profile.item_storage);

        var poke = 0;
        if (profile.currency[0].amount) {
            poke = profile.currency[0].amount;
        }

        console.log('1[i] Pokecoin: ' + poke);
        console.log('1[i] Stardust: ' + profile.currency[1].amount);
        saveProfile(profile,req.body.position, res);

    });
   });
});

router.post('/completeProfile', function(req,res,next){
  res.setHeader('Content-Type', 'application/json');
  var updatevars = {gender: req.body.gender, pref: req.body.pref, bio: req.body.bio}
  PokeTrainer.findOneAndUpdate({ username: req.body.username }, updatevars , function(err, user) {
    if (err) {
      res.send(JSON.stringify({ status: "fail", error: err }));
    }
    else{
      res.send(JSON.stringify({ status: "success"}));
    }
  });
});
module.exports = router;
