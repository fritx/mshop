/**
 * Created by fritz on 2/23/14.
 */
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
  // jquery lazyload
  // placeholder not work due to zepto
  $('img.lazy').lazyload({
    load: function () {
      $(this).closest('.lazy-box').removeClass('unloaded');
    },
    threshold: 100,
    effect: 'fadeIn'
  });
}

function toggleFooter(show) {
  var $footer = $('#footer');
  if (show) {
    $footer.show();
  } else {
    $footer.hide();
  }
}
function makeFooterToggle() {
  var $window = $(window);
  var H = $window.height();
  $window.on('resize', _.throttle(function () {
    var h = $window.height();
    if (h < 0.7 * H) {
      toggleFooter(false);
    } else {
      toggleFooter(true);
    }
    H = h;
  }, 100));
}

alertify.set({
  labels: {
    ok: '好的',
    cancel: '不要'
  }
});
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
    'name', 'shortTel', 'tel', 'block', 'flat'
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
if (!$().text || !store.enabled) {
  notify('你的浏览器没跟上时代啊!');
  throw new Error('Browser too bad.');
}

store.set('cartItems', store.get('cartItems') || []);
store.set('currOrderItems', store.get('currOrderItems') || []);
store.set('orderProfile', store.get('orderProfile') || null);
store.set('myOrders', store.get('myOrders') || []);

_.templateSettings = {
  evaluate: /{{([\s\S]+?)}}/g,
  interpolate: /{{=([\s\S]+?)}}/g,
  escape: /{{-([\s\S]+?)}}/g
};

$(function () {
  /* toggling footer */
  makeFooterToggle();
});
