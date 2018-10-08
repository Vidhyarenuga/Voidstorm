
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  email: { type: String, lowercase: true},
  facebook: String,
  google:String,
  tokens: Array,
  role: String,
  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''},
    gender: { type: String, default: ''}
  },

  coursesTeach: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],



  coursesTaken: [{
    course: { type: Schema.Types.ObjectId, ref: 'Course'}
  }],

  revenue: [{
    money: Number
  }]
});


module.exports = mongoose.model('User', UserSchema);
