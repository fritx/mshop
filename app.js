/**
 * Created by fritx on 3/23/14.
 */

var express = require('express');
var app = express();

// public content dirs
['shop', 'items'].forEach(function (dir) {
    app.use('/content/' + dir, express.static('content/' + dir));
  });
// dist dir
app.use('/', express.static('dist'));

if (module.parent) {
  module.exports = app;
} else {
  app.listen(process.env.PORT, function (err) {
    if (err) {
      throw err;
    }
  });
}
