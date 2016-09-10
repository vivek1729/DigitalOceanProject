var mongoose = require('mongoose');  
mongoose.connect('mongodb://localhost:27017/euro2012',function (error) {
    if (error) {
        console.log(error);
    }
});