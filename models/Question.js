var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  survey: {type: Schema.Types.ObjectId, required: true, trim: true},
  content: {type: String, required: true, trim: true},
  // Quesiton type 1 = select, 2 = text, 3 = long text
  type: {type: Number, required: true, trim: true}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Question = mongoose.model('Question', schema);

module.exports = Question;
