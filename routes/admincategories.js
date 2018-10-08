var express = require('express');
var router = express.Router();
var async = require('async');

path = require('path');
// Get Category model
var Category = require('../models/category');
module.exports = function(app) {

app.route('/admin/create-category')
.get(function(req, res, next) {
    res.render('admin/create-category');
  })


  .post(function(req, res, next) {
   
    async.waterfall([
      function(callback) {
        
        var category = new Category();
        category.title=req.body.title;
    
        category.save(function(err) {
         
          if (err) return next(err);
          callback(err, category);
        });
        res.redirect('/dashboard');
      },
      ]);
  });


app.route('/edit-category/:id')

        .get(function(req, res, next) {
          Category.findOne({ _id: req.params.id }, function(err,category) {
            res.render('admin/edit-category', { category: category });
          });
        })


   
        .post(function(req, res, next) {
          Category.findOne({ _id: req.params.id }, function(err, foundCategory) {
            if (foundCategory) {
              if (req.body.title) foundCategory.title = req.body.title;
             
              
              foundCategory.save(function(err) {
                if (err) return next(err);
                res.redirect('/categories');
              });
            }
          });
        });

        app.delete('/delete-categories/:id', (req, res)=>{

          Category.remove({_id: req.params.id}).then(result=>{
       
       
              res.redirect('/categories');
       
       
       
          });});


    }