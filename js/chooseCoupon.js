$(function () {
  // 
  const topupId = sessionStorage.getItem('topupId')
  const topupRmb = sessionStorage.getItem('topupRmb')
  // 请求的全局状态
  let num = 1,
  size = 500,
  couponStatus = 1,
  isExpire = 0
  // 根据条件查询我的优惠券 couponStatus1：未使用，2：已使用 isExpire是否过期【1是0否】
  function findMyCoupon  (num,size,couponStatus,isExpire) {
    const data = {
      num,
      size,
      couponStatus,
      isExpire
    }
    processCrossAjax({
      type: 'post',
      url: _SG['apiPreUrl'] + '/couponUser/selectCouponUserList',
      data: data,
      // contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        if (_SG.isReplyOk(rs)) {
          let html = ''
          let list = rs.result.list
          if (list.length > 0) {
            list.forEach(e => {
              html +=`
              <div class="coupon" data-condition="${e.useConditions}" data-id="${e.id}">
                <div class="coupon-left">
                  <div class="number">
                    <span class="money">优惠券</span>
                  </div>
                  <div class="name">
                  ${e.isExpire}
                  </div>
                </div>
                <div class="coupon-right">
                  <div class="condition">
                    <span>${e.couponName}(${e.couponTypeDispaly})</span>
                  </div>
                  <div class="date">
                    <span>到期时间:</span>
                    <span>${e.validityTime}</span>
                  </div>
                </div>
              </div>`
              $('.coupon-list').html(html)
            });
          } else {
            const html = `
            <div class="nodata-container">
              <img class="nodata-img" src="./img/nodata.png" alt="">
              <div class="nodata-text">暂无数据</div>
            </div>
            `
            $('.coupon-list').html(html)
          }
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err)
      }
    })
  }

  // 页面初始化的数据
  findMyCoupon(num,size,couponStatus,isExpire)
  // 优惠券进行选取的交互事件
  $('body').on('click', '.coupon', function () {
    var condition = $(this).data('condition')
    switch (true) {
      case condition == 0:
        $.alert('都可以使用')
        break;
      case topupRmb >= condition:
        sessionStorage.setItem('couponId', $(this).data('id')) 
        location.href = './recharge.html'
        break;
      case condition == 'undefined':
        // $.alert('未获取到使用条件')
        sessionStorage.setItem('couponId', $(this).data('id')) 
        location.href = 'recharge.html'
        break;
      default:
        $.alert('该优惠券不满足使用条件')
        break;
    }
  })
})