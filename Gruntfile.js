/**
 * Created by fritz on 3/7/14.
 */

var path = require('path');
var _ = require('underscore');

module.exports = function (grunt) {
  grunt.initConfig({
    apiType: grunt.option('api') || 'static',
    serverPort: grunt.option('port') || 8077,
    metaData: {
      title: 'Great Me',
      keywords: [
        'Great Me', '闺蜜', '女生', 'M巾', '卫生巾', '五邑大学', '袂卓'
      ],
      description: 'Great Me, 全网首家M巾专营店, 校园送货上门, 让你轻松做女人'
    },

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
        files: [{
          expand: true,
          cwd: 'bower_components/fontawesome/fonts',
          src: '**',
          dest: 'dist/fonts'
        }, {
          expand: true,
          cwd: 'src/images',
          src: '**',
          dest: 'dist/images'
        }]
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
            'bower_components/pure/menus-nr-min.css',
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
      js: {
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
            // fake jquery for some dependencies
            'src/js/as-jquery.js',
            'bower_components/jquery.lazyload/jquery.lazyload.min.js'
          ],
          'dist/js/_site.js': [
            'src/js/api/<%= apiType %>.js',
            'src/js/main.js'
          ],
          'dist/js/home.js': 'src/js/home.js',
          'dist/js/items.js': 'src/js/items.js',
          'dist/js/detail.js': 'src/js/detail.js',
          'dist/js/cart.js': 'src/js/cart.js',
          'dist/js/order.js': 'src/js/order.js',
          'dist/js/orders.js': 'src/js/orders.js'
        }
      }
    },

    jade: {
      options: {
        data: function (dest, src) {
          return _.extend({
            name: path.basename(src, '.jade')
          }, grunt.config('metaData'));
        },
        pretty: true
      },
      html: {
        files: {
          'tmp/html/index.html': 'src/jade/home.jade',
          'tmp/html/items.html': 'src/jade/items.jade',
          'tmp/html/detail.html': 'src/jade/detail.jade',
          'tmp/html/cart.html': 'src/jade/cart.jade',
          'tmp/html/order.html': 'src/jade/order.jade',
          'tmp/html/orders.html': 'src/jade/orders.jade'
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
          openOn: 'server-listen'
        },
        url: 'http://127.0.0.1:<%= serverPort %>/'
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
    'uglify', 'jade', 'htmlmin'
  ]);

  grunt.registerTask('server', function () {
    this.async();
    var app = require('./app');
    app.listen(grunt.config.data.serverPort, function (err) {
      if (err) {
        return grunt.fail.warn(err);
      }
      // trigger for open task
      grunt.event.emit('server-listen');
    });
  });
  grunt.registerTask('start', [
    'open:wait', 'server'
  ]);

  grunt.registerTask('default', [
    'build', 'start'
  ]);
};
