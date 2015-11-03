var express = require('express');
var router = express.Router();

router.route('/')
.get(function(req, res, next) {
    req.flash('flash', 'test flash!');
    res.redirect(303, '/flash');
});

router.route('/flash')
.get(function(req, res, next) {
    console.log(req.flash('flash'));
    res.send('ok');
});

module.exports = router;
