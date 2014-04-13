function listItems(items) {
  $('#items-div')
    .html(
      JST['items']({ items: items })
    );
}

function signToVal(sign) {
  return ({ '-': 1, '!': -1 })[sign];
}
function valToSign(val) {
  return ({ '1': '-', '-1': '!' })[val];
}

/* parse parameters */
var brand = params.brand || null,
  tags = params.tags || null,
  keyword = params.keyword || null;
var orderBy = params.orderBy || '-price',
  orderOp = orderBy[0],
  orderVal = signToVal(orderOp),
  orderKey = orderBy.substr(1);

initPage(function () {
  $(function () {
    /* keys to sort with */
    var $sortKeys = $('.sort-key');
    _.each($sortKeys, function (sortKey) {
      var $sortKey = $(sortKey);
      var dataBy = $sortKey.attr('data-by'),
        dataKey = dataBy.substr(1);
      var current = dataKey === orderKey;

      /* fa icon */
      var faSort = 'fa-sort';
      if (current) {
        faSort += '-' + ({ '-': 'asc', '!': 'desc' })[orderOp];
      }
      $sortKey.append('<i class="fa ' + faSort + '">');

      /* click event */
      $sortKey.on('click', function () {
        var newOrderBy = dataBy;
        if (current) {
          newOrderBy = valToSign(-1 * orderVal) + dataKey;
        }
        link(location.href, { orderBy: newOrderBy });
      });
    });

    if (tags != null && !_.isArray(tags)) {
      tags = [tags];
    }

    /* title */
    var shortTitle = '宝贝列表';
    var title = _.compact(
      [].concat(brand, tags)
    ).join('+') || shortTitle;
    setTitle(title + ' - Great Me', shortTitle);

    /* load items */
    fetchProductsList({
      brand: brand,
      tags: tags,
      keyword: keyword,
      orderVal: orderVal,
      orderKey: orderKey
    }, function (items) {
      if (items.length <= 0) {
        return notify('暂时没有此类商品', true);
      }

      /* display items */
      listItems(items);

      /* ready */
      loadReady();
    });
  });
});
