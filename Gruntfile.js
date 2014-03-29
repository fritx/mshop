/**
 * Created by fritz on 3/7/14.
 */

var path = require('path');
var _ = require('underscore');

module.exports = function (grunt) {
  grunt.initConfig({
    // load local data
    locals: (function () {
      var locals = grunt.file.readJSON('locals.json');
      ['api', 'port'].forEach(function (key) {
        locals[key] = grunt.option(key) || locals[key];
      });
      return locals;
    })(),

    clean: {
      tmp: {
        src: 'tmp'
      },
      dist: {
        src: 'dist'
      }
    },

    copy: {
      css: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/fontawesome/fonts',
            src: '**',
            dest: 'dist/fonts'
          },
          {
            expand: true,
            cwd: 'src/images',
            src: '**',
            dest: 'dist/images'
          }
        ]
      }
    },

    less: {
      css: {
        files: {
          'tmp/css/main.css': 'src/less/main.less',
          'tmp/css/home.css': 'src/less/home.less',
          'tmp/css/items.css': 'src/less/items.less',
          'tmp/css/detail.css': 'src/less/detail.less',
          'tmp/css/cart.css': 'src/less/cart.less',
          'tmp/css/order.css': 'src/less/order.less',
          'tmp/css/orders.css': 'src/less/orders.less'
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      css: {
        src: [
          'src/css/**/*.css',
          '!src/css/pure-skin-pink.css',
          'tmp/css/**/*.css'
        ]
      }
    },
    cssmin: {
      css: {
        files: {
          'dist/css/_deps.css': [
            'bower_components/fontawesome/css/font-awesome.min.css',
            'bower_components/pure/base-min.css',
            'bower_components/pure/buttons-min.css',
            'bower_components/pure/forms-nr-min.css',
            'bower_components/pure/grids-nr-min.css',
            'bower_components/pure/menus-core-min.css',
            'bower_components/alertify.js/themes/alertify.core.css',
            'bower_components/alertify.js/themes/alertify.default.css'
          ],
          'dist/css/_site.css': [
            'src/css/pure-skin-pink.css',
            'tmp/css/main.css'
          ],
          'dist/css/home.css': 'tmp/css/home.css',
          'dist/css/items.css': 'tmp/css/items.css',
          'dist/css/detail.css': 'tmp/css/detail.css',
          'dist/css/cart.css': 'tmp/css/cart.css',
          'dist/css/order.css': 'tmp/css/order.css',
          'dist/css/orders.css': 'tmp/css/orders.css'
        }
      }
    },

    jshint: {
      json: {
        src: [
          'package.json',
          '.jshintrc',
          '.csslintrc',
          'content/data/**/*.json'
        ]
      },
      js: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'Gruntfile.js',
          'src/js/**/*.js'
        ]
      }
    },
    uglify: {
      common: {
        files: {
          'dist/js/_deps.js': [
            'bower_components/underscore/underscore.js',
            'bower_components/async/lib/async.js',
            'bower_components/store.js/store.min.js',
            'bower_components/zeptojs/src/zepto.js',
            'bower_components/zeptojs/src/event.js',
            'bower_components/zeptojs/src/ajax.js',
            'bower_components/zeptojs/src/form.js',
            'bower_components/zeptojs/src/ie.js',
            'bower_components/zeptojs/src/fx.js',
            'bower_components/zeptojs/src/fx_methods.js',
            'bower_components/zeptojs/src/selector.js',
            'bower_components/alertify.js/lib/alertify.min.js',
            'bower_components/jade/runtime.js',
            // fake jquery for some dependencies
            'src/js/as-jquery.js',
            'bower_components/jquery.lazyload/jquery.lazyload.min.js'
          ],
          'dist/js/_site.js': [
            'src/js/api/<%= locals.api %>.js',
            'src/js/main.js'
          ]
        }
      },
      parts: {
        files: {
          'dist/js/home.js': [
            'src/js/home.js', 'tmp/js/home-jst.js'
          ],
          'dist/js/items.js': [
            'src/js/items.js', 'tmp/js/items-jst.js'
          ],
          'dist/js/detail.js': [
            'src/js/detail.js', 'tmp/js/detail-jst.js'
          ],
          'dist/js/cart.js': [
            'src/js/cart.js', 'tmp/js/cart-jst.js'
          ],
          'dist/js/order.js': [
            'src/js/order.js', 'tmp/js/order-jst.js'
          ],
          'dist/js/orders.js': [
            'src/js/orders.js', 'tmp/js/orders-jst.js'
          ]
        }
      }
    },

    jade: {
      jst: {
        options: {
          processName: function (file) {
            return path.basename(file, '.jade');
          },
          namespace: 'JST',
          client: true
        },
        files: {
          'tmp/js/home-jst.js': [
            'src/jade/home/banner.jade',
            'src/jade/home/brands.jade',
            'src/jade/home/boards.jade'
          ],
          'tmp/js/items-jst.js': [
            'src/jade/items/items.jade'
          ],
          'tmp/js/detail-jst.js': [
            'src/jade/detail/item.jade',
            'src/jade/detail/purchase.jade'
          ],
          'tmp/js/cart-jst.js': [
            'src/jade/cart/items.jade',
            'src/jade/cart/order.jade'

          ],
          'tmp/js/order-jst.js': [
            'src/jade/order/order.jade'
          ],
          'tmp/js/orders-jst.js': [
            'src/jade/orders/orders.jade',
            'src/jade/orders/items.jade'
          ]
        }
      },
      html: {
        options: {
          data: function (dest, src) {
            // name like home/foo/baz
            // trailing /index will be ignored
            var name = /^src\/jade\/(.+)\.jade$/.exec(src[0])[1];
            name = name.replace(/\/index$/, '');
            return {
              page: {
                name: name
              },
              meta: grunt.config('locals.meta')
            };
          },
          pretty: true
        },
        files: {
          // has to be one-to-one
          'tmp/html/index.html': 'src/jade/home/index.jade',
          'tmp/html/items.html': 'src/jade/items/index.jade',
          'tmp/html/detail.html': 'src/jade/detail/index.jade',
          'tmp/html/cart.html': 'src/jade/cart/index.jade',
          'tmp/html/order.html': 'src/jade/order/index.jade',
          'tmp/html/orders.html': 'src/jade/orders/index.jade'
        }
      }
    },
    htmllint: {
      html: {
        src: 'tmp/html/*.html'
      }
    },
    htmlmin: {
      html: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'tmp/html/index.html',
          'dist/items.html': 'tmp/html/items.html',
          'dist/detail.html': 'tmp/html/detail.html',
          'dist/cart.html': 'tmp/html/cart.html',
          'dist/order.html': 'tmp/html/order.html',
          'dist/orders.html': 'tmp/html/orders.html'
        }
      }
    },

    open: {
      wait: {
        options: {
          // listen on server task
          openOn: 'server:listen'
        },
        url: 'http://127.0.0.1:<%= locals.port %>/'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('clear', ['clean:tmp']);
  grunt.registerTask('check', [
    'clean', 'jshint:json',
    'less', 'csslint', 'jshint:js',
    'jade', 'htmllint'
  ]);

  grunt.registerTask('build', [
    'clean', 'copy', 'less', 'cssmin',
    'jade:jst', 'uglify',
    'jade:html', 'htmlmin'
  ]);

  grunt.registerTask('server', function () {
    this.async();
    var port = grunt.config('locals.port');
    var server = require('./server');
    server.listen(port, function (err) {
      if (err) {
        return grunt.fail.warn(err);
      }
      grunt.log.writeln('Server started.');
      // trigger for open task
      grunt.event.emit('server:listen');
    });
  });
  grunt.registerTask('start', [
    'open:wait', 'server'
  ]);

  grunt.registerTask('default', [
    'build', 'start'
  ]);
};
