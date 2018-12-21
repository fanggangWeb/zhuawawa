const id = getParamFromUrl('id');
// console.log(id);
let orderStatus = 0
//获取我的娃娃
function getMywawa () {
  processCrossAjax({
    type: 'post',
    url: _SG['apiPreUrl'] + '/user/selectCatchRecordList?num=1&size=100&orderStatus='+orderStatus,
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      // console.log(rs);
      let res = rs.result.list,
        html = ''
      if (_SG.isReplyOk(rs)) {
        // _html = '<div class="catch_detail">已抓中' + rs.result.total + '次</div>';
        // $('.dolls_amount').append(_html);
        if (res.length == 0) {
          const element = `
          <div class="nodata-container">
            <img class="nodata-img" src="./img/nodata.png" alt="">
            <div class="nodata-text">暂无数据</div>
          </div>
          `
          // console.log(element)
          $('.my_dolls').html(element)
        } else {
          $.each(res, (i, e) => {
            html += `<div class="doll rounded-3" data-id="${e.commodityId}" data-expressPrice="${e.expressPrice}" data-datas='${JSON.stringify(e)}'>
                      <img class="w-100 rounded-top-3" src="${e.commodityPicId}"/>
                      <div class="doll_info d-flex flex-column content-even">
                        <div class="doll_name">${e.commodityName}</div>
                          <div class="d-flex">
                          <div class="d-flex">
                          <img class="d-block icon_coin align-self-center" src="img/icon_my_coin.png">
                        </div>
                        <span class="mr-auto unit_price align-self-baseline">${e.unitPrice}/次</span>
                        <span class="deliver_status align-self-baseline">${e.isSend}</span>
                      </div>
                      <label class="weui-cell weui-check__label select-label" style="display:none" for="${e.commodityId}">
                        <div class="weui-cell__hd">
                          <input type="checkbox" class="weui-check" name="choose" id="${e.commodityId}" data-expressPrice="${e.expressPrice}" data-datas="${e}">
                          <i class="weui-icon-checked"></i>
                        </div>
                      </label>
                    </div>
                  </div>`
          });
          $('.my_dolls').html(html);
        }
      } else {
        $.alert(rs.desc)
      }
    }
  })
}
getMywawa()
// 导航栏切换
$('body').on('click', '.nav-item', function () {
  $(this).addClass('active').siblings().removeClass('active')
  orderStatus = $(this).data('type')
  getMywawa()
})
$('body').on('click', 'input[name="choose"]', function (event) {
  // console.log($(this).attr('id'))
})
let multiChoose = false // 默认是单选
$('body').on('click', '.checkbox', function () {
  let ele = document.getElementsByClassName('doll')
  if (ele.length>0) {
    $('.select-label').toggle()
    switch (multiChoose) {
      case true:
        $('.send-btn').hide()
        break;
      case false:
      $('.send-btn').show()
        break;
      default:
        break;
    }
  } else {
    return false
  }
  multiChoose = !multiChoose
})
// 点击单个娃娃
$('body').on('click','.doll', function () {
  switch (multiChoose) {
    case true:
      break;
    case false: // 单选，点击一个直接跳页面
      let sendData = []
      let data = $(this).data('datas')
      sendData.push(data)
      sessionStorage.setItem('sendData',JSON.stringify(sendData))
      break;
    default:
      break;
  }
})
// 点击请求发货
$('body').on('click','.send-btn', function () {
  let ele = document.getElementsByClassName('doll')
  let sendData = []
  for (let i = 0; i<ele.length; i++) {
    // if ($('input[name="choose"]').eq(i).attr('checked') == true) {
    //   let data = $('input[name="choose"]').eq(i).data('datas')
    //   sendData.push(data)
    // }
    console.log($('input[name="choose"]').eq(i).attributes)
  }
  // console.log(sendData)
  sessionStorage.setItem('sendData',JSON.stringify(sendData))
})