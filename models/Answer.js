var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  question: {type: Schema.Types.ObjectId, required: true, trim: true},
  content: {type: String, required: true, trim: true},
  numSelected:  {type: Number, default : 0}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Answer = mongoose.model('Answer', schema);

module.exports = Answer;
