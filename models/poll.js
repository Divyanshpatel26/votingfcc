var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Answer = require('./answer');

// set up a mongoose model
var Poll = new Schema({
  name: {
        type: String,
        unique: true,
        required: true
    },
  description: {
        type: String,
        required: true
    },
    username:{
      type:String,
      required:true
    },
    answers:[Answer],
},
    { timestamps: true
});
module.exports=mongoose.model('Poll', Poll);