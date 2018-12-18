const id = getParamFromUrl('id');
let paramsGet = {
  'num': 1,
  'size': 1000,
  'exchangeType': 1,
  'balanceType': 1
}
let paramsOut = {
  'num': 1,
  'size': 1000,
  'exchangeType': 2,
  'balanceType': 1
}
// 获取金币的记录
async function getRecords() {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/user/selectCurrencyUseList',
      data: paramsGet,
      // contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        console.log(rs);
        let res = rs.result.list;
        let html = '';
        if (_SG.isReplyOk(rs)) {
          console.log(res);
          $.each(res, (i, e) => {
            // html += '<div class="records">'
            //     + '<div class="charge d-flex">'
            //     + '<div class="charge_detail mr-auto d-inline-block">'
            //     + '<div class="charge_way">微信充值</div>'
            //     + '<div class="chargr_date">' + e.creatTime + '</div>'
            //     + '</div>'
            //     + '<div class="charge_amount d-inline-block align-self-center">+' + e.exchangeNum + '</div>'
            //     + '</div>'
            //     + '</div>'
            html += `<div class="records">
                        <div class="charge d-flex">
                          <div class="charge_detail mr-auto d-inline-block">
                            <div class="charge_way">${e.exchangeRemark}</div>
                            <div class="chargr_date">${e.createTime}</div>
                          </div>
                          <div class="charge_amount d-inline-block align-self-center">+${e.exchangeNum}</div>
                        </div>
                      </div>`
          });
          $('.records-content').html(html);
        } else {
          alert(rs.desc)
        }
        resolve(res);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    }
    processCrossAjax(ajaxSetting);
  })
}
// 获取消费列表
async function consumeRecords() {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/user/selectCurrencyUseLogList',
      data: paramsOut,
      // contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        console.log(rs);
        let res = rs.result.list;
        let html = '';
        if (_SG.isReplyOk(rs)) {
          console.log(res);
          $.each(res, (i, e) => {
            html += `<div class="records">
                        <div class="charge d-flex">
                          <div class="charge_detail mr-auto d-inline-block">
                            <div class="charge_way">${e.exchangeRemark}</div>
                            <div class="chargr_date">${e.createTime}</div>
                          </div>
                          <div class="charge_amount consume-amount d-inline-block align-self-center">-${e.exchangeNum}</div>
                        </div>
                      </div>`
          });
          $('.records-content').html(html);
        } else {
          alert(rs.desc)
        }
        resolve(res);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    }
    processCrossAjax(ajaxSetting);
  })
}
// 获取金币
function getCoin() {
  processCrossAjax ({
    type: 'post',
    url: _SG['apiPreUrl'] + '/home/selectUserBasicOnCount',
    // contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      console.log(rs);
      let res = rs.result[0].balance;
      let html = '';
      if (_SG.isReplyOk(rs)) {
        console.log(res);
        $('.number').html(res);
      } else {
        alert(rs.desc)
      }
    }
  })
}
  $('body').on('click', '.tab-item', function () {
    const index = $(this).index()
    console.log(index)
    $(this).addClass('active').siblings().removeClass('active')
    switch (index) {
      case 0:
        getRecords()
        break;
      case 1:
        consumeRecords()
        break;
      default:
        break;
    }
  })
  getRecords()
  getCoin()