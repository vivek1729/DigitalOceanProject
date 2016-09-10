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
	}
});
PokeSchema.index({location: '2dsphere'});
var PokeTrainer = mongoose.model('PokeTrainer', PokeSchema);

//Remove the collection from database. During testing
PokeTrainer.remove({}, function(err) { 
   console.log('collection removed'); 
});
// make this available to our users in our Node applications
module.exports = PokeTrainer;