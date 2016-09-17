var express = require('express');
var router = express.Router();
var PokemonGO = require('../poke.io.js');
var PokeTrainer = require('../models/poketrainer');

var a = new PokemonGO.Pokeio();
var stat_props = ["level","pokemons_captured","battle_attack_won","battle_attack_total","battle_training_won","battle_training_total","poke_coin","star_dust"];

var saveProfile = function(profile, currentLocation, res){
  console.log("Save profile called");
  var user_stats = {};
  for(var i=0;i<stat_props.length && profile.player_stats !== null ;i++){
    user_stats[stat_props[i]] = profile.player_stats[stat_props[i]];
  }
  var position = {type: "Point", coordinates: [currentLocation.coords.longitude,currentLocation.coords.latitude]}; //longitude need to come first!
  res.setHeader('Content-Type', 'application/json');
  var trainer = new PokeTrainer({username: profile.username, location: position, stats: user_stats});
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
        else{
        //Default operation. Find user and update location
          PokeTrainer.findOneAndUpdate({ username: profile.username }, {location: position} , function(err, trainer) {
            if (err) {
              res.send(JSON.stringify({ status: "fail", error: err }));
            }
            else{
              res.send(JSON.stringify({ status: "success", profile: trainer}));
            }
          });
      }
    }
  });
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/nearby/:maxdis', function(req,res,next){
    var maxdis = (parseInt(req.params.maxdis))*1000;
    var ref = req.body.location;
    var gender = req.body.pref === "both" ? ["male","female"] : [req.body.pref];
    var geoOptions =  {
        spherical: true,
        maxDistance: maxdis,
        query: { gender: {$in: gender}, pref :{$in:[ req.body.gender, "both" ]}, likes : {$nin: [req.body.username]}}
    };
    PokeTrainer.geoNear(ref, geoOptions, function(err, results, stats) {
        var locations;
        console.log('Geo Results', results);
        console.log('Geo stats', stats);
        if (err) {
            console.log('geoNear error:', err);
            res.send(JSON.stringify({ status: "error", error: err}));
        } else {
            res.send(JSON.stringify({ status: "success", result: results}));
        }
    });

});

router.post('/like', function(req,res,next){
  var username = req.body.username;
  var liked = req.body.liked;
  PokeTrainer.findOneAndUpdate({username: profile.username },{ $addToSet: {likes: [liked]}}, function(err,trainer){
    if (err) {
          res.send(JSON.stringify({ status: "fail", error: err }));
    }
    else{
          res.send(JSON.stringify({ status: "success", profile: trainer}));
    }
  });
});

router.post('/login', function(req, res, next) {
  //Initiate Pokemon stuff
  a.init(req.body.username, req.body.password, req.body.position, "ptc", function(err) {
    if (err) throw err;
    var coin = 0;
    var stardust = 0;
    a.GetProfile(function(err, profile) {
        if(err){
          res.send(JSON.stringify({ status: "fail", error: err }));
        }
        coin = profile.currency[0].amount ? profile.currency[0].amount : 0 ;
        stardust = profile.currency[1].amount ? profile.currency[1].amount : 0;
        a.GetInventory(function(err, inventory) {
          if(err){
            res.send(JSON.stringify({ status: "fail", error: err }));
          }
          console.log(inventory);
          var items = null;
          profile.player_stats = null;
          if(inventory !== undefined && inventory.hasOwnProperty("inventory_delta"))
            {
              items = inventory.inventory_delta.inventory_items;
            }
          console.log("Items in inventory");
          console.log(items);
          for(var i=0;items !== null && i<items.length;i++){
              if(items[i].inventory_item_data.player_stats !== null)
              {
                profile.player_stats = items[i].inventory_item_data.player_stats;
                profile.player_stats.poke_coin = coin;
                profile.player_stats.star_dust = stardust;
              }
          }
          saveProfile(profile,req.body.position, res);
        });
        

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
