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
      description: 'Great Me, 全网首家M巾专营店, 校园送货上门, 让你轻松做女人',
      transparent: 'content/images/shop/transparent.gif'
    },

    clean: {
      tmp: {
        src: 'tmp'
      },
      dist: {
        src: 'dist'
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
          'tmp/css/**/*.css',
          '!tmp/css/**/global.*'
        ]
      }
    },
    cssmin: {
      css: {
        files: {
          'tmp/css/home.min.css': 'tmp/css/home.css',
          'tmp/css/items.min.css': 'tmp/css/items.css',
          'tmp/css/detail.min.css': 'tmp/css/detail.css',
          'tmp/css/cart.min.css': 'tmp/css/cart.css',
          'tmp/css/order.min.css': 'tmp/css/order.css',
          'tmp/css/orders.min.css': 'tmp/css/orders.css',
          'tmp/css/main.min.css': 'tmp/css/main.css',
          'tmp/css/global.min.css': [
            'bower_components/fontawesome/css/font-awesome.min.css',
            'bower_components/pure/base-min.css',
            'bower_components/pure/buttons-min.css',
            'bower_components/pure/forms-nr-min.css',
            'bower_components/pure/grids-nr-min.css',
            'bower_components/pure/menus-nr-min.css',
            'bower_components/alertify.js/themes/alertify.core.css',
            'bower_components/alertify.js/themes/alertify.default.css',
            'src/css/pure-skin-pink.css',
            'tmp/css/main.min.css'
          ]
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
          'tmp/js/global.min.js': [
            'bower_components/underscore/underscore.js',
            'bower_components/async/lib/async.js',
            'bower_components/store.js/store.min.js',
            'bower_components/zeptojs/src/zepto.js',
            'bower_components/zeptojs/src/event.js',
            'bower_components/zeptojs/src/ajax.js',
            'bower_components/zeptojs/src/form.js',
            'bower_components/zeptojs/src/ie.js',
            'bower_components/zeptojs/src/detect.js',
            'bower_components/zeptojs/src/fx.js',
            'bower_components/zeptojs/src/fx_methods.js',
            'bower_components/zeptojs/src/selector.js',
            'bower_components/alertify.js/lib/alertify.min.js',
            // fake jquery for some dependencies
            'src/js/as-jquery.js',
            'bower_components/jquery.lazyload/jquery.lazyload.min.js',
            'src/js/api/<%= apiType %>.js',
            'src/js/main.js'
          ],
          'tmp/js/home.min.js': 'src/js/home.js',
          'tmp/js/items.min.js': 'src/js/items.js',
          'tmp/js/detail.min.js': 'src/js/detail.js',
          'tmp/js/cart.min.js': 'src/js/cart.js',
          'tmp/js/order.min.js': 'src/js/order.js',
          'tmp/js/orders.min.js': 'src/js/orders.js'
        }
      }
    },

    concat: {
      css: {
        options: {
          separator: '\n'
        },
        files: {
          'dist/css/home-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/home.min.css'
          ],
          'dist/css/items-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/items.min.css'
          ],
          'dist/css/detail-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/detail.min.css'
          ],
          'dist/css/cart-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/cart.min.css'
          ],
          'dist/css/order-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/order.min.css'
          ],
          'dist/css/orders-bundle.min.css': [
            'tmp/css/global.min.css', 'tmp/css/orders.min.css'
          ]
        }
      },
      js: {
        options: {
          separator: '\n;'
        },
        files: {
          'dist/js/home-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/home.min.js'
          ],
          'dist/js/items-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/items.min.js'
          ],
          'dist/js/detail-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/detail.min.js'
          ],
          'dist/js/cart-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/cart.min.js'
          ],
          'dist/js/order-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/order.min.js'
          ],
          'dist/js/orders-bundle.min.js': [
            'tmp/js/global.min.js', 'tmp/js/orders.min.js'
          ]
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

    copy: {
      css: {
        expand: true,
        cwd: 'bower_components/fontawesome/fonts',
        src: '**',
        dest: 'dist/fonts'
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
    'clean', 'copy:css', 'less', 'cssmin', 'concat:css',
    'uglify', 'concat:js', 'jade', 'htmlmin'
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
