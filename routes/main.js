

var Course = require('../models/course');
var User = require('../models/user');
var Category = require('../models/category');
var Fos= require('../models/fos');
var async = require('async');

module.exports = function(app) {
 
  app.get('/', function(req, res, next) {
    res.render('main/home');
  });

  app.get('/courses', function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/courses', { courses: courses });
    });
  });

 
  app.get('/mostpopular', function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/mostpopular', { courses: courses });
    });
  });
//---------<Get request to display the categories>-----------
app.get('/categories', function(req, res, next) {
  Category.find({}, function(err, categories) {
    res.render('admin/categories', { categories: categories });
  });
});

//---------<Get request to display the categories>-----------
app.get('/fos', function(req, res, next) {
  Fos.find({}, function(err, fos) {
    res.render('admin/fos', { fos: fos });
    
  });
});

app.get('/dashboard', function(req, res, next) {
  Category.find({}, function(err, categories) {
    res.render('admin/dashboard', { categories: categories });
  });
});

//---------<Get request to display the users>-----------
app.get('/users', function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('admin/allusers', { users: users });
  });
});

//---------<Get request to display the teacher>-----------
app.get('/teachers', function(req, res, next) {
  User.find({role:"teacher"}, function(err, users) {
    res.render('admin/teacher', { users: users });
  });
});

app.get('/student', function(req, res, next) {
  User.find({role:null}, function(err, users) {
    res.render('admin/student', { users: users });
  });
});
 //---------<Get request to display the courses>-----------
 app.get('/course', function(req, res, next) {
  Course.find({}, function(err, courses) {
    res.render('admin/courses', { courses: courses });
  });
});
  app.get('/courses/:id', function(req, res, next) {

    async.parallel([
      function(callback) {

        Course.findOne({ _id: req.params.id })
        .populate('ownByStudent.user')
        .exec(function(err, foundCourse) {
          callback(err, foundCourse);
        });
      },
   
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id})
        .populate('coursesTaken.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },

     
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.id})
        .populate('coursesTeach.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },
    ], function(err, results) {
      var course = results[0];
      var userCourse = results[1];
      var teacherCourse = results[2];
      if (userCourse === null && teacherCourse === null) {
        res.render('courses/courseDesc', { course: course });
      } else if (userCourse === null && teacherCourse != null) {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      } else {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      }
    });
  });


}
