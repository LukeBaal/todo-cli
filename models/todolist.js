const mongoose = require('mongoose');

//todo-list Schema
const todoSchema = mongoose.Schema({
  date: { type: Date },
  name: { type: String}
});

//Define and export
module.exports = mongoose.model('Todo', todoSchema);