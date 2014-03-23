/**
 * Created by fritz on 3/1/14.
 */
function showOrder() {
  var checkedItems = _.where(xItems, { checked: true });
  var cost = _.reduce(checkedItems, function (memo, item) {
    return memo + item._price * item.num;
  }, 0);
  /* fix floating bug */
  cost = Math.round(cost * 10) / 10;
  var order = {
    cost: cost,
    count: checkedItems.length
  };
  var orderTmplFn = _.template($('#order-tmpl').html());
  var orderHtml = orderTmplFn(order);
  $('#order-div').html(orderHtml);
}

function prepareOrder() {
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
  });
}

function listItems() {
  var $itemsList = $('#items-list');
  var itemTmplFn = _.template($('#item-tmpl').html());
  var itemsHtml = _.reduceRight(xItems, function (memo, xItem) {
    return memo + itemTmplFn(xItem);
  }, '');
  $itemsList.html(itemsHtml);
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
  var checkedItems = _.where(xItems, { checked: true });
  if (checkedItems.length <= 0) {
    return notify('没有勾选的宝贝');
  }
  if (_.some(checkedItems, function (item) {
    return item.num <= 0;
  })) {
    return notify('宝贝数量至少为1');
  }
  prepareOrder();
  saveCurrOrder(checkedItems, function () {
    location.href = 'order.html';
  });
}

/* variables */
var xItems;

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
