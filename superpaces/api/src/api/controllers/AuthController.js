/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');
var sha1 = require('sha1');
module.exports = {

  index: function(req, res) {
    res.view();
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('http://177.10.0.10/');
  },

  getUser: function(req, res){

    if(req.session.passport !== undefined){
      User.findOne({id : req.session.passport.user}).populate('courses').exec(function(err, user){

        if(err){
          res.send(false);
        } else {
          res.send(user);
        }
      });
    } else {
      res.send(false);
    }

  },

  registerUser: function(req, res){
    //var user = req.param('user');

    var user = {
      provider: 'local',
      firstname : req.param('firstname'),
      lastname : req.param('lastname'),
      name : req.param('firstname') + ' ' + req.param('lastname'),
      email : req.param('email'),
      password : sha1(req.param('password'))
    }

    User.findOne({email : user.email}).exec(function(err, userFound){

      if(err){
        res.view('500');
      } else {

        if(!userFound){
          User.create(user).exec(function(err, record){
            req.logIn(record, function(err) {
              if (err) {
                res.view('500');
              }
              res.redirect('http://177.10.0.10/');
            });
          });
        }

      }
    });
  },

  // https://developers.facebook.com/docs/
  // https://developers.facebook.com/docs/reference/login/
  local: function(req, res) {
    passport.authenticate('local', { failureRedirect: '/login', scope: ['email'] }, function(err, user, info) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }
        res.redirect('http://177.10.0.10/');
        return;
      });
    })(req, res);
  },

  // https://developers.facebook.com/docs/
  // https://developers.facebook.com/docs/reference/login/
  facebook: function(req, res) {
    passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }
        res.redirect('http://177.10.0.10/');
        return;
      });
    })(req, res);
  },

  // https://apps.twitter.com/
  // https://apps.twitter.com/app/new
  twitter: function(req, res) {
    passport.authenticate('twitter', { failureRedirect: '/login' }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('http://177.10.0.10/');
        return;
      });
    })(req, res);
  }
};
