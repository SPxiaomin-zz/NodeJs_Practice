var express = require('express');
var spawn = require('child_process').spawn;

var app = express();

app.get('/ps', function(req, res) {
  ps = spawn('ps', ['aux']);

  ps.stdout.pipe(res);
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
