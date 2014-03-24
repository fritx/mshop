/**
 * Created by fritz on 3/4/14.
 */
function showBanner(banner) {
  var $banner = $('#banner');
  var bannerTmplFn = _.template($('#banner-tmpl').html());
  var bannerHtml = bannerTmplFn(banner);
  $banner.find('.lazy-box').html(bannerHtml);
}

function listHeros(heros) {
  var $herosList = $('#heros-list');
  var heroTmplFn = _.template($('#hero-tmpl').html());
  var herosHtml = _.reduce(heros, function (memo, hero) {
    return memo + heroTmplFn(hero);
  }, '');
  $herosList.html(herosHtml);
}

function listBrands() {
  var $brandsList = $('#brands-div').find('.list');
  var brandTmplFn = _.template($('#brand-tmpl').html());
  var brandsHtml = _.reduce(brands, function (memo, brand) {
    return memo + brandTmplFn(brand);
  }, '');
  $brandsList.html(brandsHtml);
}

function showBrands() {
  if (brands.length <= 0) {
    return notify('暂时没有品牌');
  }
  $('#brands-btn').toggleClass('active');
  $('#brands-div').toggleClass('none');
  brandsOn = !brandsOn;
  if (brandsOn) {
    location.href = '#brands-btn';
  }
}

function doSearch() {
  var keyword = $('#search input').val();
  if (!keyword) {
    return;
  }
  location.href = 'items.html' + paramsToSearch({
    keyword: keyword
  });
}

var brands, brandsOn = false;

$(function () {
  /* title */
  setTitle('Great Me');

  /* active */
  $('#footer').find('.fa-home').closest('a')
    .addClass('active').removeAttr('href');

  /* load shop */
  fetchShop(function (shop) {
    brands = _.map(shop.brands, function (brand) {
      return {
        name: brand
      };
    });

    /* display banner */
    showBanner(shop.banner);

    /* display heros */
    listHeros(shop.heros);

    /* display brands */
    listBrands();

    /* ready */
    loadReady();
  });
});
