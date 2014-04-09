function fetchShop(cb) {
  $.get('../gettags.php', function (data) {
    var shop = JSON.parse(data);
    // TODO: php side has no banner yet
    shop.banner = shop.banner || (shop.banners && shop.banners[0]) || {
      alt: 'Great Me',
      src: 'content/shop/banners/0.jpg',
      url: null
    };
    cb({
      brands: shop.brands,
      tags: shop.tags,
      banner: {
        alt: shop.banner.alt,
        src: shop.banner.src,
        href: shop.banner.url
      },
      boards: _.map(shop.advs, function (adv) {
        return {
          alt: adv.alt,
          src: adv.src,
          href: adv.url
        };
      })
    });
  });
}
function fetchProductsList(opt, cb) {
  opt = opt || {};
  var brand = opt.brand, tags = opt.tags,
    keyword = opt.keyword,
    orderVal = opt.orderVal, orderKey = opt.orderKey;
  var o = {}, url;
  o.way = ({
    'sales': 'sales',
    'price': 'low_price'
  })[orderKey] + '_' + ({
    '-1': 'DESC',
    '1': 'ASC'
  })[orderVal];

  if (keyword) {
    url = '../search.php';
    o.keyword = keyword;
  } else {
    url = '../getgoodslist.php';
    if (brand) {
      o.brand = brand;
    } else if (tags) {
      o.tags = tags[0];
    }
  }

  $.get(url, o, function (data) {
    var dItems = JSON.parse(data);
    var items = _.map(dItems, parseItem);
    cb(items);
  });
}
function fetchProduct(opt, cb) {
  $.get('../getgoods.php?id=' + opt.id, function (data) {
    var dItems = JSON.parse(data);
    var item = parseItem(dItems && dItems[0]);
    cb(item);
  });
}
function fetchCart(cb) {
  var cItems = store.get('cartItems');
  if (cItems.length <= 0) {
    return cb(cItems);
  }
  async.map(cItems, function (cItem, next) {
    fetchProduct({ id: cItem.id }, function (item) {
      if (item == null) {
        return next(null, item);
      }
      var xItem = _.extend(cItem, {
        title: item.title,
        image: item.image,
        onSale: item.onSale,
        _price: item._price
      });
      next(null, xItem);
    });
  }, function (err, xItems) {
    cb(_.compact(xItems));
  });
}
function fetchCurrOrder(cb) {
  var oItems = store.get('currOrderItems');
  async.map(oItems, function (oItem, next) {
    fetchProduct({ id: oItem.id }, function (item) {
      var xItem = _.extend(oItem, {
        _price: item._price
      });
      next(null, xItem);
    });
  }, function (err, xItems) {
    cb(xItems);
  });
}
function fetchOrdersList(cb) {
  var orders = store.get('myOrders');
  if (orders.length <= 0) {
    return cb(orders);
  }
  async.map(orders, function (order, next) {
    async.map(order.items, function (oItem, next) {
      fetchProduct({ id: oItem.id }, function (item) {
        if (!item) {
          return next(null, null);
        }
        var xItem = _.extend(oItem, {
          title: item.title,
          image: item.image,
          _price: item._price
        });
        next(null, xItem);
      });
    }, function (err, xItems) {
      order.items = _.compact(xItems);
      if (order.items.length <= 0) {
        return next(null, null);
      }
      next(null, order);
    });
  }, function (err, xOrders) {
    cb(_.compact(xOrders));
  });
}
function checkOnSale(oItems, cb) {
  async.every(oItems, function (oItem, next) {
    fetchProduct({ id: oItem.id }, function (item) {
      next(item.onSale);
    });
  }, function (ok) {
    cb(ok);
  });
}
function saveOrder(oItems, profile, extra, cb) {
  var orders = store.get('myOrders');
  orders.push({
    items: oItems,
    profile: profile,
    extra: extra
  });
  store.set('myOrders', orders);
  saveOrderProfile(profile, function () {
    $.post('../order.php', {
      consumer_name: profile.name,
      telephone: profile.shortTel + '/' + profile.tel,
      address: profile.block + '-' + profile.flat,
      products_id: _.pluck(oItems, 'id').join(','),
      products_amounts: _.pluck(oItems, 'num').join(','),
      message: extra.message
    }, function (data) {
      cb(data === 'ok');
    });
  });
}
function parseItem(dItem) {
  if (!dItem) {
    return null;
  }
  var item = {
    id: +dItem.id,
    title: dItem.title,
    description: dItem.description,
    image: dItem.small_url,
    imageLarge: dItem.large_url,
    sales: +dItem.sales,
    onSale: dItem.on_sale === '1',
    promotingPrice: dItem.low_price ? +dItem.low_price : null,
    shopPrice: +dItem.middle_price,
    marketPrice: +dItem.high_price
  };
  calcPrice(item);
  return item;
}
function fetchAreasList(cb) {
  $.get('../getarealist.php', function (data) {
    var areas = JSON.parse(data);
    cb(_.map(areas, function (area) {
      return {
        id: +area.id,
        title: area.areaname
      };
    }));
  });
}
function saveArea(area, cb) {
  var profile = store.get('orderProfile');
  store.set('orderProfile', _.extend(profile, {
    area: area.title
  }));
  $.post('../setarea.php', { area_id: area.id }, function (data) {
    cb(!!data);
  });
}
