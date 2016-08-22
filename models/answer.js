var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Answer = new Schema({
    name     :{
      type:String,
      unique:true,
      required:true
      
    } 
  , count:{
    type:Number,
    default: 0
  }
});
mongoose.model('Answer',Answer);
