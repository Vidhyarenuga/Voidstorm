/*-
Creating a schema for the courses 
used an array because each course is owned by many students
*/



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: String,
  slug: String,

});

//--------module to export database---------
module.exports = mongoose.model('Category', CategorySchema);
