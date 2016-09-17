var mongoose = require('mongoose');  
var PokeSchema = mongoose.Schema({
    username: String,
    gender: String,
    pref: String,
    bio: String,
    location: {
    'type': {
      type: String,
      required: true,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point'
     },
     coordinates: [Number]
	  },
    stats:{
      level:Number,
      pokemons_captured:Number,
      battle_attack_won:Number,
      battle_attack_total:Number,
      battle_training_won:Number,
      battle_training_total:Number,
      poke_coin:Number,
      star_dust:Number
    },
    likes: [String]
});
PokeSchema.index({location: '2dsphere'});
var PokeTrainer = mongoose.model('PokeTrainer', PokeSchema);

var mock_data = [new PokeTrainer({username: "Gurgaon_user", location: {type : "Point", coordinates: [77.0266383,28.4594965]}, gender: "male", pref: "female", bio: "From ggn",likes:["x","y"]}),
new PokeTrainer({username: "Noida_user", location: {type : "Point", coordinates: [77.3910265,28.5355161]}, gender: "female", pref: "female", bio: "From noida",likes:["x","y"]}),
new PokeTrainer({username: "Saket_user", location: {type : "Point", coordinates: [77.206615,28.5245787]}, gender: "male", pref: "both", bio: "From saket", likes:["user_id","x","y"]}),
new PokeTrainer({username: "Dwarka_user", location: {type : "Point", coordinates: [77.0460481,28.5921401]}, gender: "female", pref: "both", bio: "From dwarka",likes:["x","y"]}),
new PokeTrainer({username: "Hiranandani_user", location: {type : "Point", coordinates: [72.9091436,19.1153798]}, gender: "male", pref: "female", bio: "From Hira",likes:["x","y"]}),
new PokeTrainer({username: "Colaba_user", location: {type : "Point", coordinates: [72.8147123,18.9067031]}, gender: "female", pref: "both", bio: "From Colaba",likes:["x","y"]}),
new PokeTrainer({username: "Pune_user", location: {type : "Point", coordinates: [73.8567437,18.5204303]}, gender: "female", pref: "male", bio: "From Puna",likes:["x","y"]})
];
//Remove the collection from database. During testing
PokeTrainer.remove({}, function(err) { 
   console.log('collection removed');
   //Clear collection and then enter mock data
   PokeTrainer.create(mock_data,function(err,candies){
    if(!err)
      console.log('collection filled with mock data');
   }); 

});
// make this available to our users in our Node applications
module.exports = PokeTrainer;