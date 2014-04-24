/**
 * Created by fritx on 3/23/14.
 */

var path = require('path');
var express = require('express');
var app = express();

// static
var contentDir = path.resolve(__dirname, '../content');
var distDir = path.resolve(__dirname, '../dist');
['shop', 'items'].forEach(function (dir) {
  app.use('/content/' + dir, express.static(contentDir + '/' + dir));
});
app.use('/', express.static(distDir));

// expose api listen
exports.listen = function (port, cb) {
  app.listen(port, function (err) {
    if (!err) {
      process.title = 'mshop-server:' + port;
    }
    cb(err);
  });
};
