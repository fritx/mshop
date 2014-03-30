function showForm(profile) {
  // default fields
  var fields = [
    {
      readonly: true,
      title: '地　区',
      key: 'area',
      value: area.title
    },
    {
      title: '收货人',
      key: 'name'
    },
    {
      title: '短　号',
      key: 'shortTel'
    },
    {
      title: '长　号',
      key: 'tel'
    },
    {
      title: '宿舍楼',
      key: 'block'
    },
    {
      title: '宿舍号',
      key: 'flat'
    },
    {
      key: 'message',
      placeholder: '给 Great Me 留言'
    }
  ];
  // fill profile
  if (profile) {
    _.each(fields, function (field) {
      field.value = profile[field.key] || field.value;
    });
  }
  $('#form-div')
    .html(JST['order']({
      fields: _.partition(fields, function (field) {
        return field.title;
      }),
      cost: _.reduce(oItems, function (memo, oItem) {
        return memo + oItem._price * oItem.num;
      }, 0)
    }));
}

function emptyCurrOrder(cb) {
  fetchCart(function (cItems) {
    /* cut from cart items */
    _.each(oItems, function (oItem) {
      var cItem = _.findWhere(cItems, { id: oItem.id });
      if (cItem != null) {
        cItem.num -= oItem.num;
      }
    });
    cItems = _.filter(cItems, function (cItem) {
      return cItem.num > 0;
    });

    saveCart(cItems, function () {
      saveCurrOrder(oItems = [], function () {
        cb();
      });
    });
  });
}

function submitOrder() {
  var profile = _.reduce($('.profile-box').find('[name]'), function (memo, el) {
    var $el = $(el);
    memo[$el.attr('name')] = $el.val();
    return memo;
  }, {});
  var extra = _.reduce($('.submit-box').find('[name]'), function (memo, el) {
    var $el = $(el);
    memo[$el.attr('name')] = $el.val();
    return memo;
  }, {});
  if (_.some(['area', 'name', 'tel', 'block', 'flat'], function (key) {
    return profile[key] === '';
  })) {
    return notify('订单填写不完整');
  }
  // disable submit button
  $('.submit-btn').attr('disabled', true);
  ask('确定提交订单?', function (ok) {
    if (!ok) {
      $('.submit-btn').removeAttr('disabled');
      return;
    }
    saveOrder(oItems, profile, extra, function () {
      emptyCurrOrder(function () {
        notify('订单提交成功', 'orders.html');
      });
    });
  });
}

/* variables */
var oItems;

initPage(function () {
  $(function () {
    /* title */
    setTitle('确认下单 - Great Me', '确认下单');

    /* load order */
    fetchCurrOrder(function (_oItems) {
      oItems = _oItems;

      if (oItems.length <= 0) {
        return notify('没有勾选的宝贝', true);
      }

      fetchOrderProfile(function (profile) {
        /* list items */
        showForm(profile);

        /* ready */
        loadReady();
      });
    });
  });
});
