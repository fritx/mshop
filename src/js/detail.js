/**
 * Created by fritz on 2/22/14.
 */
function showItem(item) {
  var itemTmplFn = _.template($('#item-tmpl').html());
  var itemHtml = itemTmplFn(item);
  $('#item-div').html(itemHtml);
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
    return notify('宝贝数量至少为1');
  }
  $num.val(1);
  /*if (item.stocks <= 0) {
   return notify('此商品正在火速补货中，明天才可以下单哦~');
   }*/

  var items = store.get('cartItems');
  var itemIn;
  if (itemIn = _.findWhere(items, { id: id })) {
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
  cb();
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

$(function () {
  /* load item */
  fetchProduct({ id: id }, function (_item) {
    item = _item;

    if (!item) {
      notify('宝贝不存在', true);
    }

    /* title */
    setTitle(item.title + ' - GreatMe', '宝贝详情');

    /* extend item */
    calcPrice(item);

    /* display item */
    showItem(item);

    /* ready */
    loadReady();
  });
});
