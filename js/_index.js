localStorage.setItem('userInfo', JSON.stringify({
  'data': {
    "createTime": 1544436023000,
    "deviceType": "1",
    "headPicUrl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Iol74jr4tE6dWteunxgyrZvlgRwsM24ic8x5pXIGib8q0FTNrspsoBt3J8dyJoF1hgN1Q2w3fxFl2FKYicAOg00eQ/132",
    "id": "f6df0f06d5964d7b8517667883f19c6d",
    "invitationCode": "81659533",
    "isDelete": false,
    "isInvite": "0",
    "nickName": "暂时想不出来",
    "showId": "ofsocfmd",
    "signInDay": 1545667200000,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDU3MjU0MzcsInN1YiI6IntcIm5pY2tOYW1lXCI6XCLmmoLml7bmg7PkuI3lh7rmnaVcIixcInVzZXJOYW1lXCI6XCLmipPlqIPlqIM5MjI5NjRcIixcInVzZXJJZFwiOlwiZjZkZjBmMDZkNTk2NGQ3Yjg1MTc2Njc4ODNmMTljNmRcIn0iLCJleHAiOjE1NDc3OTkwMzcsIm5iZiI6MTU0NTcyNTQzN30.-ZH5nAXTD1vuzmtSSJoZJR-wKLO4W01lCdLH5AxvrhM",
    "userName": "抓娃娃922964",
    "userStyle": "1",
    "wheadImgPath": "http://thirdwx.qlogo.cn/mmopen/vi_32/Iol74jr4tE6dWteunxgyrZvlgRwsM24ic8x5pXIGib8q0FTNrspsoBt3J8dyJoF1hgN1Q2w3fxFl2FKYicAOg00eQ/132"
  }          
}))
//登录
var gettoken = _SG['user'].getInfo();
var code = getParamFromUrl("code");
if (gettoken && gettoken.token) {
  processCrossAjax({
    type: 'get',
    url: _SG['apiPreUrl'] + '/home/isOpenDailyCheckIn',
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      if (_SG.isReplyOk(rs)) {
        if (rs.result.userSign == 2) {
          // $("#windowqiandao").remove();
        } else {
          $("#windowqiandao").show();
          var signInWeek = rs.result.signInWeek ? rs.result.signInWeek : 0;
          processCrossAjax({
            type: 'post',
            url: _SG['apiPreUrl'] + '/signIn/signInList',
            contentType: "application/json;charset=UTF-8",
            success: function (rs) {
              if (_SG.isReplyOk(rs)) {
                let res = rs.result.list;
                var html = "";
                for (var i = 0; i < 6; i++) {
                  if (i < signInWeek) {
                    html += '<div class="sixdaysbefore-item" style="background:rgba(0,0,0,0.7);"><img src="img/icon_big_gold.png" />' + res[i].number + '</div>';
                  } else {
                    html += '<div class="sixdaysbefore-item"><img src="img/icon_big_gold.png" />' + res[i].number + '</div>';
                  }
                }
                html += '<div style="clear:both;"></div>';
                var html1 = '<img src="img/icon_big_gold.png" />' + res[6].number;
                $(".sixdaysbefore").html(html);
                $(".seventhday").html(html1);
              } else {
                $.alert(rs.desc);
              }
            },
            error: function (error) {
              console.log(error)
            }
          })
        }
      } else {
        $.alert(rs.desc);
      }
    },
    error: function (error) {
      console.log(error)
    }
  })
} else if (code != '' && code != null && code != undefined) {
  if (gettoken && gettoken.token) {
    processCrossAjax({
      type: 'get',
      url: _SG['apiPreUrl'] + '/home/isOpenDailyCheckIn',
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        if (_SG.isReplyOk(rs)) {
          if (rs.result.userSign == 2) {
            // $("#windowqiandao").remove();
          } else {
            $("#windowqiandao").show();
            var signInWeek = rs.result.signInWeek ? rs.result.signInWeek : 0;
            processCrossAjax({
              type: 'post',
              url: _SG['apiPreUrl'] + '/signIn/signInList',
              contentType: "application/json;charset=UTF-8",
              success: function (rs) {
                if (_SG.isReplyOk(rs)) {
                  let res = rs.result.list;
                  var html = "";
                  for (var i = 0; i < 6; i++) {
                    if (i < signInWeek) {
                      html += '<div class="sixdaysbefore-item" style="background:rgba(0,0,0,0.7);"><img src="img/icon_big_gold.png" />' + res[i].number + '</div>';
                    } else {
                      html += '<div class="sixdaysbefore-item"><img src="img/icon_big_gold.png" />' + res[i].number + '</div>';
                    }
                  }
                  html += '<div style="clear:both;"></div>';
                  var html1 = '<img src="img/icon_big_gold.png" />' + res[6].number;
                  $(".sixdaysbefore").html(html);
                  $(".seventhday").html(html1);
                } else {
                  $.alert(rs.desc);
                }
              },
              error: function (error) {
                console.log(error)
              }
            })
          }
        } else {
          $.alert(rs.desc);
        }
      },
      error: function (error) {
        console.log(error)
      }
    })
  } else {
    _SG.user.clearInfo();
    var inviteCode = getParamFromUrl("state");
    if (inviteCode == "STATE") {
      var urls = _SG['apiPreUrl'] + '/login?wxCode=' + code + '&weixinLogin=1';
    } else {
      var urls = _SG['apiPreUrl'] + '/login?wxCode=' + code + '&weixinLogin=1' + '&inviteCode=' + inviteCode;
    }
    $.ajax({
      type: 'post',
      url: urls,
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        if (_SG.isReplyOk(rs)) {
          _SG.user.setInfo(rs.result);
          processCrossAjax({
            type: 'get',
            url: _SG['apiPreUrl'] + '/home/isOpenDailyCheckIn',
            contentType: "application/json;charset=UTF-8",
            success: function (rs) {
              if (_SG.isReplyOk(rs)) {
                if (rs.result.userSign == 2) {
                  // $("#windowqiandao").remove();
                } else {
                  $("#windowqiandao").show();
                  var signInWeek = rs.result.signInWeek ? rs.result.signInWeek : 0;
                  processCrossAjax({
                    type: 'post',
                    url: _SG['apiPreUrl'] + '/signIn/signInList',
                    contentType: "application/json;charset=UTF-8",
                    success: function (rs) {
                      if (_SG.isReplyOk(rs)) {
                        let res = rs.result.list;
                        var html = "";
                        for (var i = 0; i < 6; i++) {
                          if (i < signInWeek) {
                            html += '<div class="sixdaysbefore-item" style="background:rgba(0,0,0,0.7);"><img src="img/icon_big_gold.png" />' + res[i].number + '</div>';
                          } else {
                            html += '<div class="sixdaysbefore-item"><img src="img/icon_big_gold.png" />' + res[i].number + '</div>';
                          }
                        }
                        html += '<div style="clear:both;"></div>';
                        var html1 = '<img src="img/icon_big_gold.png" />' + res[6].number;
                        $(".sixdaysbefore").html(html);
                        $(".seventhday").html(html1);
                      } else {
                        $.alert(rs.desc);
                      }
                    },
                    error: function (error) {
                      console.log(error)
                    }
                  })
                }
              } else {
                $.alert(rs.desc);
              }
            },
            error: function (error) {
              console.log(error)
            }
          })
        } else {
          $.alert(rs.desc)
        }
      }
    })
  }
} else {
  $("#windowqiandao").remove();
  if (gettoken && gettoken.token) {

  } else {
    $.toast("token过期，请重新进入进行授权登录", "forbidden");
    // alert("token过期，请重新授权登录");
  }
}



//获取轮播图片；
function getSwiperList() {
  return processCrossAjax({
    type: 'get',
    url: _SG['apiPreUrl'] + '/back/banner/selectBannerListOnBannerType?bannerType=1',
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      // console.log(rs);
      if (_SG.isReplyOk(rs)) {
        let res = rs.result;
        let html = '';
        $.each(res, (i, e) => {
          html += '<a href="bannerdetail.html?id=' + e.id + '" class="swiper-slide">\n' +
            ' <img id="banner_' + i + '" src="' + e.realUrlPath + '">\n' +
            '</a>';
        })
        $('.swiper-wrapper').html(html)
      } else {
        $.alert(rs.desc);
      }
    },
    error: function (error) {
      console.log(error)
    }
  })
}

//项目切换；
const columnSwitch = async () => {
  $('#nav ul li').on('click', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    let subjectId = $(this).find('a').attr('id').toString().slice(4);
    getMachineInfos(subjectId);
  })
};

//进入娃娃机；
const enterMachine = async () => {
  $('.machine').on('click', function () {
    let mcId = $(this).attr('id').slice(0);
    location.href = 'playGame.html?mcId=' + mcId;
  })
};

//根据项目展示娃娃机；
const getMachineInfos = async (subjectCategoryId) => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/home/selectMachineInfoList?num=1&size=1000&subjectCategoryId=' + subjectCategoryId,
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        if (_SG.isReplyOk(rs)) {
          let res = rs.result.list;
          let html = '';
          let html_2 = '';
          $.each(res, function (j, k) {
            let free = k.isFree,
              statusDesc = '',
              statusClass = '';
            if (free == 0) {
              statusClass = 'bg-free';
              statusDesc = '空闲中';
            } else {
              statusClass = 'bg-busy';
              statusDesc = '热抓中';
            }
            html += '<div class="machine flex-column" id="' + k.id + '">' +
              '<img class="" src="' + k.realFilePath + '"/>' +
              '<div class="d-flex">' +
              '<div class="d-flex my-2">' +
              '<img class=" icon_coin align-self-center ml-2" src="img/icon_my_coin.png">' +
              '</div><div class="cl_y align-self-center ml-2">' + k.consumption + ' 币 / 次</div></div>' +
              '<div class="ml-2 fb">' + k.machineName + '</div>' +
              '<div class="d-flex m-auto status ' + statusClass + '">' + statusDesc + '</div>' +
              '</div>';
          });
          html_2 =
            '<div id="content_"' + subjectCategoryId + ' class="img-container flex justify-content-between flex-wrap">' +
            html +
            '</div>';
          $('#machines').html(html_2);
          resolve();
          enterMachine();
          // selectMachine();
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err)
      }
    };
    processCrossAjax(ajaxSetting)
  })
};

//获取项目列表；
const getSubjectList = async () => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/home/subjectCategoryList?num=1&size=10&columnType=2',
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        console.log(rs);
        if (_SG.isReplyOk(rs)) {
          let res = rs.result.list;
          resolve(res);
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

//展示项目列表
const showSubjectList = async (res) => {
  return new Promise((resolve, reject) => {
    let html = '';
    $.each(res, (i, e) => {
      if (i != 0) {
        html += '<li class="nav-item">\n' +
          '<a class="nav-link" id="nav_' + e.id + '" href="#">' + e.columnName + '</a>\n' +
          '</li>';
      } else {
        html += '<li class="nav-item active">\n' +
          '<a class="nav-link" id="nav_' + e.id + '" href="#">' + e.columnName + '</a>\n' +
          '</li>';
      }
    });
    $('#nav ul').html(html);
    resolve(res[0].id);
    columnSwitch();
  })
};

(async () => {
  let subjectList = await getSubjectList();
  let subjectId = await showSubjectList(subjectList);
  let machineInfos = await getMachineInfos(subjectId);
})();

//跳转到‘我的’；
$('#index_mine').on('click', function () {
  if (_SG['user'].getInfo()) {
    let id = _SG['user'].getInfo().id;
    location.href = 'mine.html?id=' + id;
  } else {
    $.toast('未找到登录用户,请重新登录', 'forbidden', 2500)
  }
})

$(".qiandaobtn").on("click", function () {
  processCrossAjax({
    type: 'post',
    url: _SG['apiPreUrl'] + '/signIn/OnclickSignIn',
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      if (_SG.isReplyOk(rs)) {
        $.alert("签到成功");
        $("#windowqiandao").remove();
      } else {
        $.alert(rs.desc);
        $("#windowqiandao").remove();
      }
    },
    error: function (error) {
      console.log(error)
    }
  })
})

$(function () {
  // 异步刷新轮播图 防止循环失效
  setSwiper()
  async function setSwiper() {
    await getSwiperList()
    var mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal', // 垂直切换选项
      loop: true, // 循环模式选项
      observer: true,
      observeParents: true,
      slidesPerview: 'auto',
      autoplay: {
        disableOnInteraction: false, //默认true
        delay: 3000, //默认3000
      },
      autoplayDisableOnInteraction: false,
      speed: 500,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
      },
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // 如果需要滚动条
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    })
  }
  $(window).scroll(function () {
    let nav = document.querySelector('#nav')
    if ($(window).scrollTop() > 212) {
      nav.style.position = 'fixed'
      nav.style.top = 0
      nav.style.zIndex = 1
    } else {
      nav.style.position = 'relative'
    }
  });
})