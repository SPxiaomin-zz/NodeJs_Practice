var express = require('express');
var router = express.Router();

router.route('/foo')
.get(function(req, res, next) {
    res.send('you viewed this page ' + req.session.views['/foo'] + ' times');
});

router.route('/bar')
.get(function(req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + 'times');
});

module.exports = router;
