const router = require('express').Router();
const Student = require('../models/user');

router.route('/').get(function(req,res,next) {
    Student.find({}, function(err,user) {
        if(err) return next(err);
        return res.json(user);
    })
})

module.exports = router;
