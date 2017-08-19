const router = require('express').Router()
const async = require('async')
const Student = require('../models/user');
const passport = require('passport')
const passConfig = require('../configs/passportconf');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/uploads')
	},
	filename: function(req, file, callback) {
		console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})
const upload = multer({dest: 'public/uploads/',
    storage: storage
})

router.route('/signup')
.post(function(req, res, next) {
    async.waterfall([
        function(callback) {
            userData = {};
            userData.username = req.body.username;
            userData.email = req.body.email;
            userData.phone = req.body.phone;
            userData.password = req.body.password;

            var newUser = new Student(userData);

            Student.findOne({email: req.body.email}, function(err, userExist) {
                if (err) return next(err)
                if(userExist) {
                    req.flash("errors", "User already exists");
                    return res.redirect('/signup');
                }
                else {
                    Student.create(userData, function(err, small) {
                        if (err) return next(new Error('Something is wrong'));
                        else return res.redirect('/')
                    })
                }
            })
        }
    ])
})
.get(function(req,res,next) {
    Student.find({}, function(err,user) {
        if(err) return next(err);
        return res.render('html/signup', {errors: req.flash("errors")})
    })
})

router.route('/login')
.post(
        passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureFlash: true,
        successFlash: 'successfully authenticated'
    }))
    .get(function(req,res,next) {
    if(req.user) res.redirect('/');
    res.render('html/login', {message: req.flash('message')});
})

router.route('/logout').get(function(req,res) {
    req.logout();
    res.redirect('/');
})

router.route('/').get(function(req,res,next) {
    res.render('html/home');
})

router.route('/profile').get(function(req,res,next) {
    res.render('html/profile',{user: req.user});
})

router.route('/update').post(upload.single('avatar'), function(req,res,next) {
    Student.update({username: req.user.username}, {
        profile: {photopath: req.file.filename,
                age: req.body.age,
        },
        email: req.body.email,
        phone: req.body.phone,
    }, function(err) {
        if(err) return next(err);
        return res.redirect('/profile')
    })
}).get(function(req,res,next) {
    return res.render('html/update-profile');
})

// function isLoggedIn(req,res,next) {
//     if(req.isAuthenticated())
//         return next()
//     res.redirect('/')
// }

module.exports = router;
