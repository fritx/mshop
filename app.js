/**
 * Created by fritx on 3/23/14.
 */

var express = require('express');
var app = express();

app.use('/content', express.static('content'));
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
