function showOrder() {
  var checkedItems = _.where(xItems, { checked: true });
  var cost = _.reduce(checkedItems, function (memo, item) {
    return memo + item._price * item.num;
  }, 0);
  /* fix floating bug */
  cost = Math.round(cost * 10) / 10;
  $('#order-div')
    .html(JST['order']({
      items: xItems,
      cost: cost,
      count: checkedItems.length
    }));
}

function prepareOrder(cb) {
  $('.tick').each(function (i, el) {
    var $tick = $(el);
    var $item = $tick.closest('.item-box');
    var item = _.findWhere(xItems, {
      id: +$item.attr('data-id')
    });
    var $num = $item.find('.num');
    item.num = Math.max(1, +$num.val() || 0);
    $num.val(item.num);
    item.checked = $tick.is('.on');
  });
  saveCart(xItems, function () {
    showOrder();
    if (cb) {
      cb();
    }
  });
}

function listItems() {
  $('#items-div')
    .html(
      // reverse items list
      JST['items']({ items: xItems.reverse() })
    );
  /* tick event */
  $('.tick').on('click', function () {
    $(this).toggleClass('on');
    prepareOrder();
  });
  $('.num').on('change', function () {
    prepareOrder();
  });
}

function removeFromCart() {
  var checkedItems = _.where(xItems, { checked: true });
  if (checkedItems.length <= 0) {
    return notify('没有勾选的宝贝');
  }
  ask('确定移除勾选的宝贝?', function (ok) {
    if (ok) {
      xItems = _.where(xItems, { checked: false });
      saveCart(xItems, function () {
        notify('宝贝已移除');
        location.reload();
      });
    }
  });
}

function gotoOrder() {
  prepareOrder(function () {
    var checkedItems = _.where(xItems, { checked: true });
    if (checkedItems.length <= 0) {
      return notify('没有勾选的宝贝');
    }
    if (_.some(checkedItems, function (item) {
      return item.num <= 0;
    })) {
      return notify('宝贝数量至少为1');
    }
    checkAllOnSale(checkedItems, function (ok) {
      if (!ok) {
        return notify('部分商品仍在补货中，可以先购买其他的~');
      }
      saveCurrOrder(checkedItems, function () {
        location.href = 'order.html';
      });
    });
  });
}

/* variables */
var xItems;

initPage(function () {
  $(function () {
    /* title */
    setTitle('购物车 - Great Me', '购物车');

    /* active */
    $('#footer').find('.fa-shopping-cart').closest('a')
      .addClass('active').removeAttr('href');

    /* load items */
    fetchCart(function (_xItems) {
      xItems = _xItems;

      if (xItems.length <= 0) {
        return notify('购物车暂时没有宝贝', true);
      }

      /* list items */
      listItems();

      /* display order desc */
      showOrder();

      /* ready */
      loadReady();
    });
  });
});
