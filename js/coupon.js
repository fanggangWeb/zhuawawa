$(function () {
  // 请求的全局状态
  let num = 1,
  size = 500,
  couponStatus = 1,
  isExpire = 0
  const makeTabActive = function () {
    $('body').on('click', '.tab', function () {
      const index = $(this).index()
      num = 1
      $(this).addClass('active').siblings().removeClass('active')
      switch (index) {
        case 0: // 未使用的优惠券
          couponStatus=1
          isExpire=0
          break;
        case 1: // 已使用的优惠券
          couponStatus=2
          isExpire=''
          break;
        case 2: // 已过期的优惠券
          couponStatus=1
          isExpire=1
          break;
        default:
          break;
      }
      findMyCoupon(num,size,couponStatus,isExpire)
    })
  }
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
          // console.log('coupon'+rs)
          let html = ''
          let list = rs.result.list
          if (list.length > 0) {
            list.forEach(e => {
              html +=`
                <div class="coupon">
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
  makeTabActive()
  findMyCoupon(num,size,couponStatus,isExpire)
})