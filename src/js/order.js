/**
 * Created by fritz on 3/4/14.
 */
function showForm(profile) {
  profile = profile || {
    name: '',
    shortTel: '',
    tel: '',
    block: '',
    flat: ''
  };
  var formTmplFn = _.template($('#form-tmpl').html());
  var formHtml = formTmplFn({
    cost: _.reduce(oItems, function (memo, oItem) {
      return memo + oItem._price * oItem.num;
    }, 0),
    profile: profile
  });
  $('#form-div').html(formHtml);
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
  var profile = {
    name: $('[name="name"]').val(),
    shortTel: $('[name="shortTel"]').val(),
    tel: $('[name="tel"]').val(),
    block: $('[name="block"]').val(),
    flat: $('[name="flat"]').val()
  };
  var extra = {
    message: $('[name="message"]').val()
  };
  if (_.some(['name', 'tel', 'block', 'flat'], function (key) {
    return profile[key] === '';
  })) {
    return notify('订单填写不完整');
  }
  ask('确定提交订单?', function (ok) {
    if (!ok) {
      return;
    }
    $('.submit-btn').attr('disabled', true);
    saveOrder(oItems, profile, extra, function () {
      emptyCurrOrder(function () {
        notify('订单提交成功', 'orders.html');
      });
    });
  });
}

/* variables */
var oItems;

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
