function showItem(item) {
  $('#item-div')
    .html(
      JST['item']({ item: item })
    );
}

function deltaNum(delta) {
  var $num = $('#num');
  var val = (+$num.val() || 0) + delta;
  $num.val(Math.max(1, val));
}

function addToCart(silient, cb) {
  var $num = $('#num');
  var num = +$num.val();
  if (isNaN(num) || num <= 0) {
    return notify('宝贝数量至少为 1 件');
  }
  $num.val(1);
  if (!item.onSale || num > item.store) {
    return notify('正在补货中，明天才可以购买哦~');
  }

  var items = store.get('cartItems');
  var itemIn = _.findWhere(items, { id: id });
  if (itemIn) {
    itemIn.num += num;
  } else {
    items.push({
      id: id,
      num: num,
      checked: true
    });
  }
  store.set('cartItems', items);
  if (!silient) {
    notify('已加入购物车');
  }
  if (cb) {
    cb();
  }
}

function gotoCart() {
  addToCart(true, function () {
    location.href = 'cart.html';
  });
}

/* parse parameters */
var params = searchToParams(location.href);
var id = +params.id;
var item;

initPage(function () {
  $(function () {
    /* load item */
    fetchProduct({ id: id }, function (_item) {
      item = _item;

      if (!item) {
        notify('宝贝不存在', true);
      }

      /* title */
      setTitle(item.title + ' - Great Me', '宝贝详情');

      /* extend item */
      calcPrice(item);

      /* display item */
      showItem(item);

      /* ready */
      loadReady();
    });
  });
});
