/**
 * Created by fritz on 3/4/14.
 */
function listOrders(orders) {
  _.each(orders, function (order) {
    order.profile = order.profile || {};
    order.extra = order.extra || {};
    order.cost = _.reduce(order.items, function (memo, item) {
      return memo + item._price * item.num;
    }, 0);
    order.status = order.status || '谢谢惠顾';
  });
  $('#orders-div')
    .html(
      // reverse orders
      JST['orders']({ orders: orders.reverse() })
    );
}

function initPage() {
  $(function () {
    /* title */
    setTitle('我的订单 - Great Me', '我的订单');

    /* active */
    $('#footer').find('.fa-user').closest('a')
      .addClass('active').removeAttr('href');

    /* load orders */
    fetchOrdersList(function (orders) {
      if (orders.length <= 0) {
        return notify('暂时没有订单', true);
      }

      /* list items */
      listOrders(orders);

      /* ready */
      loadReady();
    });
  });
}
