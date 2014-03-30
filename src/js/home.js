function showBanner(banner) {
  $('#banner').find('.lazy-box')
    .html(
      JST['banner']({ banner: banner })
    );
}

function listBoards(boards) {
  $('#boards-div')
    .html(
      JST['boards']({ boards: boards })
    );
}

function listBrands() {
  $('#brands-div').find('.pure-menu')
    .append(
      JST['brands']({ brands: brands })
    );
}

function showBrands() {
  if (brands.length <= 0) {
    return notify('暂时没有品牌');
  }
  $('#brands-btn').toggleClass('active');
  $('#brands-div').toggleClass('none');
  brandsOn = !brandsOn;
  if (brandsOn) {
    $(window).scrollTop($('#brands-btn').offset().top);
  }
}

var brands, brandsOn = false;

function initPage() {
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

      /* display boards */
      listBoards(shop.boards);

      /* display brands */
      listBrands();

      /* ready */
      loadReady();
    });
  });
}
