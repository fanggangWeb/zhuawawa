let topupid = "",
    topuprmb = ''
// 获取剩余金币数
const getBalance = function () {
  return new Promise((resolve, reject) => processCrossAjax({
    type: 'post',
    url: _SG['apiPreUrl'] + '/home/selectUserBasicOnCount',
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      if (_SG.isReplyOk(rs)) {
        let res = rs.result;
        $('.coin_amount').html(res[0].balance);
        // console.log(res[0].balance)
      } else {
        $.toast(rs.desc, 'forbidden');
      }
    },
    error: function (err) {
      console.log(err)
    }
  }))
}
// 获取充值券的列表
function getTopupList() {
  return processCrossAjax({
    type: 'get',
    url: _SG['apiPreUrl'] + '/recharge/selectRechargeListByPage?num=1&size=10&mealType=1',
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      console.log(rs);
      if (_SG.isReplyOk(rs)) {
        let res = rs.result.list;
        let html = '';
        $.each(res, (i, e) => {
          // console.log(e.picId);
          html += '<div class="w-45 meals" data-rmb=' + e.rmb + ' data-id=' + e.id + '>' +
            '<img class="w-100 h-auto" src="' + e.picId + '"/>' +
            '</div>';
        });
        $('.img-container').html(html);
        // 选取优惠券后id,和人民币放置到缓存中
        $('.img-container').find('.meals').click(function () {
          topupid = $(this).data("id")
          topuprmb = $(this).data('rmb')
          sessionStorage.setItem('topupId', topupid)
          sessionStorage.setItem('topupRmb', topuprmb)
          // console.log(topupid+'分隔开'+topuprmb)
          $(".selecttopup").remove();
          var html = '<img src="img/select.png" class="selecttopup" />';
          $(this).append(html);
        })
      } else {
        alert(rs.desc);
      }

    },
    error: function (err) {
      console.log(err)
    }
  });
}
// 与缓存内的优惠券id进行比对，如果有则添加选中的样式
function resetCoupon() {
  const topupId = sessionStorage.getItem('topupId')
  if (topupId) {
    let meals = $('.meals')
    for (let i = 0; i < meals.length; i++) {
      if (meals.eq(i).attr('data-id') == topupId) {
        $(".selecttopup").remove();
        let html = '<img src="img/select.png" class="selecttopup" />';
        meals.eq(i).append(html);
      }
    }
  }
}
// 优惠券跨页面的交互
async function couponInteraction() {
  await getTopupList()
  resetCoupon()
}
getBalance()
couponInteraction()

// 从本地拿娃娃币的数量
// let rs = _SG.cache.getData('res');
// if (rs != 'undefined' && rs != null) {
//   $('.coin_amount').html(rs[0].balance);
// }
//点击充值项进行充值；
const topup = async (id, couponId) => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/recharge/creatRechargeOrder?rechargeMode=1&rechId=' + id + '&rechType=1&couponId=' + couponId,
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        // console.log(rs);
        if (_SG.isReplyOk(rs)) {
          processCrossAjax({
            type: 'post',
            url: _SG['apiPreUrl'] + '/pay/wx/weixinPayHtml?orderId=' + rs.result.orderId,
            contentType: "application/json;charset=UTF-8",
            success: function (ress) {
              if (_SG.isReplyOk(ress)) {
                const onBridgeReady = function () {
                  WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                      "appId": ress.result.appid, // 公众号名称，由商户传入
                      "timeStamp": ress.result.timestamp, // 时间戳，自1970年以来的秒数
                      "nonceStr": ress.result.noncestr, // 随机串
                      "package": ress.result.package,
                      "signType": ress.result.signtype, // 微信签名方式：
                      "paySign": ress.result.sign // 微信签名
                    },
                    function (res) {
                      // console.log(res)
                      if (res.err_msg == "get_brand_wcpay_request:ok") {
                        $.toast('支付成功')
                        // 支付成功后，重新刷新一下金币数
                          getBalance()
                        //  使用以上方式判断前端返回,微信团队郑重提示：
                        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                      } else {
                        $.toast('支付失败', 'forbidden')
                      }
                    })
                }
                if (typeof WeixinJSBridge == "undefined") {
                  if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                  } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                  }
                } else {
                  onBridgeReady();
                }
              }
            },
            error: function (err) {
              console.log(err)
            }
          });
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err)
      }
    };
    processCrossAjax(ajaxSetting);
  })
};
$(".surepay").click(function () {
  const topupId = sessionStorage.getItem('topupId')
  const topupRmb = sessionStorage.getItem('topupRmb')
  const couponId = sessionStorage.getItem('couponId')
  if (topupId) {
    topup(topupId, couponId)
  } else {
    $.alert('请选取充值金额')
  }
})
$('.choose-coupon').click(function () {
  location.href = 'chooseCoupon.html'
})