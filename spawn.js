var spawn = require('child_process').spawn;
var child = spawn(process.argv[2], process.argv.slice(3));

child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);
child.on('close', function () {
  process.exit();
});
