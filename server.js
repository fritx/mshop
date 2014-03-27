/**
 * Created by fritx on 3/23/14.
 */

var express = require('express');
var app = express();

// static
['shop', 'items'].forEach(function (dir) {
  app.use('/content/' + dir, express.static('content/' + dir));
});
app.use('/', express.static('dist'));

// expose api listen
exports.listen = function (port, cb) {
  app.listen(port, function (err) {
    if (!err) {
      process.title = 'mshop-server:' + port;
    }
    cb(err);
  });
};
