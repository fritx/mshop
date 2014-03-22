function fetchShop(cb) {
  $.get('content/data/shop.json', function (shop) {
    cb(shop);
  });
}
function fetchProductsList(opt, cb) {
  opt = opt || {};
  var seperator = ',';
  var brand = opt.brand,
    tags = opt.tags,
    keyword = opt.keyword,
    orderVal = opt.orderVal,
    orderKey = opt.orderKey;
  $.get('content/data/items.json', function (items) {
    // select items
    if (brand != null) {
      items = _.where(items, { brand: brand });
    }
    if (tags != null) {
      items = _.filter(items, function (item) {
        return 1 <= _.intersection(item.tags, tags).length;
      });
    }
    if (keyword != null) {
      keyword = keyword.replace(seperator, '');
      items = _.filter(items, function (item) {
        return ~item.brand.indexOf(keyword) ||
          ~item.tags.join(seperator).indexOf(keyword) ||
          ~item.title.indexOf(keyword) ||
          ~item.description.indexOf(keyword);
      });
    }
    _.each(items, function (item) {
      calcPrice(item);
    });
    // sort items
    if (orderKey != null) {
      var field = ({
        'sales': 'sales',
        'price': '_price'
      })[orderKey];
      items = _.sortBy(items, function (item) {
        return orderVal * item[field];
      });
    }
    cb(items);
  });
}
function fetchProduct(opt, cb) {
  fetchProductsList(null, function (items) {
    var item = _.findWhere(items, { id: opt.id });
    cb(item);
  });
}
function fetchCart(cb) {
  var cItems = store.get('cartItems');
  if (cItems.length <= 0) {
    return cb(cItems);
  }
  fetchProductsList(null, function (dItems) {
    var xItems = _.map(cItems, function (cItem) {
      var dItem = _.findWhere(dItems, { id: cItem.id });
      if (!dItem) {
        return null;
      }
      var xItem = _.extend(cItem, {
        title: dItem.title,
        image: dItem.image,
        _price: dItem._price
      });
      return xItem;
    });
    cb(_.compact(xItems));
  });
}
function fetchCurrOrder(cb) {
  var oItems = store.get('currOrderItems');
  fetchProductsList(null, function (dItems) {
    var xItems = _.map(oItems, function (cItem) {
      var dItem = _.findWhere(dItems, { id: cItem.id });
      if (!dItem) {
        return null;
      }
      var xItem = _.extend(cItem, {
        _price: dItem._price
      });
      return xItem;
    });
    cb(xItems);
  });
}
function fetchOrdersList(cb) {
  var orders = store.get('myOrders');
  if (orders.length <= 0) {
    return cb(orders);
  }
  fetchProductsList(null, function (items) {
    var xOrders = _.map(orders, function (order) {
      order.items = _.map(order.items, function (oItem) {
        var item = _.findWhere(items, { id: oItem.id });
        return item ? _.extend(oItem, {
          title: item.title,
          image: item.image,
          _price: item._price
        }) : null;
      });
      order.items = _.compact(order.items);
      return order;
    });
    cb(_.compact(xOrders));
  });
}
function saveOrder(oItems, profile, extra, cb) {
  var orders = store.get('myOrders');
  orders.push({
    items: oItems,
    status: '谢谢惠顾',
    profile: profile,
    extra: extra
  });
  store.set('myOrders', orders);
  saveOrderProfile(profile, function () {
    console.log('下单:', oItems, profile, extra);
    cb();
  });
}
