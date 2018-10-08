var express = require('express');
var router = express.Router();
var async = require('async');

path = require('path');
// Get Category model
var Fos = require('../models/fos');
module.exports = function(app) {

app.route('/admin/create-fos')
.get(function(req, res, next) {
    res.render('admin/create-fos');
  })


  .post(function(req, res, next) {
   
    async.waterfall([
      function(callback) {
        
        var fos = new Fos();
        fos.title=req.body.title;
    
        fos.save(function(err) {
         
          if (err) return next(err);
          callback(err, fos);
        });
        res.redirect('/dashboard');
      },
      ]);
  });


app.route('/edit-fos/:id')

        .get(function(req, res, next) {
          Fos.findOne({ _id: req.params.id }, function(err,fos) {
            res.render('admin/edit-fos', { fos: fos });
          });
        })


   
        .post(function(req, res, next) {
          Fos.findOne({ _id: req.params.id }, function(err, foundfos) {
            if (foundfos) {
              if (req.body.title) foundfos.title = req.body.title;
             
              
              foundfos.save(function(err) {
                if (err) return next(err);
                res.redirect('/fos');
              });
            }
          });
        });

        // app.delete('/delete-categories/:id', (req, res)=>{

        //   Category.remove({_id: req.params.id}).then(result=>{
       
       
        //       res.redirect('/categories');
       
       
       
        //   });});


    }