var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuizSchema = Schema({
  name: {type: String, required: true},
  title: {type: String, required: true},
  responsible: {type: String, required: true},
  discription: {type: String, required: true},
  severity: {type: String, required: true},
  question: {type: String, required: true},
  status: {type: String, required: true},
});

module.exports = mongoose.model('Quiz', QuizSchema);