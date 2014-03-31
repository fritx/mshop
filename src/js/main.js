function searchToParams(search) {
  var pat = /([^?=&#]*)=([^?=&#]+)/g, params = {};
  decodeURIComponent(search)
    .replace(pat, function (a, b, c) {
      if (b in params) {
        if (!_.isArray(params[b])) {
          params[b] = [params[b]];
        }
        params[b].push(c);
      } else {
        params[b] = c;
      }
    });
  return params;
}

function paramsToSearch(params) {
  return _.reduce(params, function (search, val, key) {
    var arr = _.isArray(val) ? val : [val];
    return search + (search ? '&' : '?') +
      _.reduce(arr, function (segs, v) {
        return segs + (segs ? '&' : '') + key + '=' + encodeURIComponent(v);
      }, '');
  }, '');
}

function loadReady() {
  _.delay(function () {
    $('.back-btn').find('i').toggleClass('fa-spinner fa-spin fa-angle-left');
  }, 300);
  // show content
  //$('#content').removeClass('none');
  // jquery lazyload
  // placeholder not work due to zepto
  $('img.lazy').lazyload({
    load: function () {
      $(this).closest('.lazy-box').removeClass('unloaded');
    },
    threshold: 200,
    effect: 'fadeIn'
  });
}

function toggleFooter(show) {
  var $footer = $('#footer');
  if (show) {
    $footer.removeClass('none');
  } else {
    $footer.addClass('none');
  }
}
function makeFooterToggle() {
  var $window = $(window);
  var H = $window.height();
  $window.on('resize', _.debounce(function () {
    var h = $window.height();
    if (h < 0.7 * H) {
      toggleFooter(false);
    } else {
      // fix weixin keyboard toggle bug
      $window.scrollTop($window.scrollTop() - 1);
      toggleFooter(true);
    }
    H = h;
  }, 300));
}

function notify(msg, back) {
  // message
  alertify.alert(msg, function () {
    // redirect
    if (back === true) {
      history.back();
    } else if (_.isString(back)) {
      location.href = back;
    }
  });
}
function ask(msg, cb) {
  alertify.confirm(msg, cb);
}

function calcPrice(item) {
  item._price = item.promotingPrice != null ?
    item.promotingPrice :
    item.ourPrice;
}
function fetchOrderProfile(cb) {
  var profile = store.get('orderProfile');
  cb(profile);
}
function saveOrderProfile(profile, cb) {
  store.set('orderProfile', _.pick(profile, [
    'area', 'name', 'shortTel', 'tel', 'block', 'flat'
  ]));
  cb();
}
function saveCart(xItems, cb) {
  store.set('cartItems', _.map(xItems, function (xItem) {
    return _.pick(xItem, ['id', 'num', 'checked']);
  }));
  cb();
}
function saveCurrOrder(xItems, cb) {
  store.set('currOrderItems', _.map(xItems, function (xItem) {
    return _.pick(xItem, ['id', 'num']);
  }));
  cb();
}

function setTitle(title, shortTitle) {
  $('title').text(title);
  $('.title-text').text(shortTitle || title);
}

/* init */
var params = searchToParams(location.href);
var area;

function initPage(cb) {
  if (!$().text || !store.enabled) {
    notify('你的浏览器没跟上时代啊!');
    throw new Error('Browser too bad.');
  }

  store.set('cartItems', store.get('cartItems') || []);
  store.set('currOrderItems', store.get('currOrderItems') || []);
  store.set('orderProfile', store.get('orderProfile') || {});
  store.set('myOrders', store.get('myOrders') || []);

  fetchAreasList(function (areas) {
    var profile = store.get('orderProfile');
    area = params.area ? _.findWhere(areas, { id: +params.area }) :
      _.findWhere(areas, { title: profile.area }) || areas[0];
    if (!area) {
      notify('你的地区信息不对啊!');
      throw new Error('Invalid area.');
    }

    saveArea(area, function () {
      _.templateSettings = {
        evaluate: /{{([\s\S]+?)}}/g,
        interpolate: /{{=([\s\S]+?)}}/g,
        escape: /{{-([\s\S]+?)}}/g
      };

      alertify.set({
        labels: {
          ok: '好的',
          cancel: '不要'
        }
      });

      $(function () {
        /* toggling footer */
        makeFooterToggle();
      });

      cb();
    });
  });
}
