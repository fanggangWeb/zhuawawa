//获取娃娃机ID
const id = getParamFromUrl('mcId');
console.log(id);
var myPlayer;
var playurl = [];
var firstenter = true;
//直播渲染
const liveRender = (videoUrl) => {
  let url = videoUrl.slice(4);
  //  let player = new TcPlayer('live', {
  //      "m3u8": "http" + url + ".m3u8",
  //      // "flv": "http"+url+".flv",
  //      "autoplay": true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
  //      // "coverpic" : "",
  //      "controls": "none",//显示和隐藏控制条
  //      // "flash": true,
  //      "live": true,//设置视频是否为直播类型，将决定是否渲染时间轴等控件，以及区分点直播的处理逻辑
  //  });
  //  $('#live').find('video').attr('id', videoUrl);
  //  $('#live').find('video').attr('id', videoUrl);
  $("#roomVideo").find("source").attr("src", "http" + url + ".m3u8");
  if (firstenter) {
    myPlayer = videojs('roomVideo', {
      autoplay: true
    }, function onPlayerReady() {
      document.getElementById('roomVideo').style.width = window.screen.width + "px";
      document.getElementById('roomVideo').style.height = window.screen.height + "px";
      this.on('play', function () {
        $('.vjs-loading-spinner').remove();
      })
      this.on('pause', function () {
        $(".winnerdetail").show();
      })
    });
    firstenter = false;
  } else {
    myPlayer.src({
      src: "http" + url + ".m3u8",
      type: "application/x-mpegURL"
    });
  }
  document.getElementById('entergame').addEventListener('click', function () {
    myPlayer.play();
    $(".winnerdetail").hide();
  })
};
//切换视角
const viewSwitch = async (data) => {
  $('.viewSwitch').on('click', async () => {
    let currentUrl = '';
    var indexurl = $("#roomVideo").find("source").attr("src");
    if (playurl.length == 1) {

    } else if (playurl.length > 1) {
      if (indexurl == ("http" + playurl[0].url.slice(4) + ".m3u8")) {
        await $('#live').empty();
        liveRender(data[1].url);
      } else {
        await $('#live').empty();
        liveRender(data[0].url);
      }
    }

  })
};

//获取剩余金币数
const getBalance = async () => {
  new Promise((resolve, reject) => processCrossAjax({
    type: 'post',
    url: _SG['apiPreUrl'] + '/home/selectUserBasicOnCount',
    contentType: "application/json;charset=UTF-8",
    success: function (rs) {
      if (_SG.isReplyOk(rs)) {
        let res = rs.result;
        _SG.cache.setData('coinInfo', res);
        $('#balance').html(res[0].balance);
        return (res[0].balance)
        // console.log(res[0].balance)
      } else {
        alert(rs.desc);
      }
    },
    error: function (err) {
      console.log(err)
    }
  }))
};

//获取机器信息
const getMachineInfo = async () => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/home/selectMachineInfoListById?id=' + id,
      contentType: "application/json;charset=UTF-8",
      success: (rs) => {
        if (_SG.isReplyOk(rs)) {
          if (rs.result.isCollection) {
            $(".collectwawa .isok").show();
            $(".collectwawa .isnot").hide();
          } else {
            $(".collectwawa .isok").hide();
            $(".collectwawa .isnot").show();
          }
          resolve(rs);
        } else {
          console.log(rs.desc);
        }
      },
      error: (err) => {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
};

//展示机器信息
const handleMachineInfo = async (rs) => {
  return new Promise(async (resolve, reject) => {
    let res = rs.result,
      txList = res.txList,
      html = '';
    console.log(res);
    playurl = res.txList;
    // console.log(txList.length);

    _SG.cache.setData('machineName', res.machineName);
    _SG.cache.setData('consumption', res.consumption);
    _SG.cache.setData('txList', res.txList);

    if (res.musicId != '') {
      html = '<audio autoplay>' +
        '<source src="http://' + res.musicId + '" type="audio/mpeg">' +
        '</audio>';
      $('#live').after(html);
      $('.toPay span').html(res.consumption)
    } else {
      console.log('无背景音乐')
    }

    $('#consumption').html(res.consumption); //消费
    $('#machineName').html(res.machineName); //机器名
    $('.doll_info').html(res.machineDesc); //娃娃详情
    $('.doll_info img').css('width', '100%');

    getBalance();
    handleFree();
    if (txList && txList.length != 0) {
      await liveRender(txList[0].url);
      await viewSwitch(res.txList);
    }
  })
}

//获取并展示机器信息
(async () => {
  let machineInfo = await getMachineInfo();
  let showInfo = await handleMachineInfo(machineInfo);
})();


//判断是否空闲
const isFree = async () => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/home/isFreeMachineInfoById?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        let res = rs.result;
        if (_SG.isReplyOk(rs)) {
          console.log(res.isFree);
        } else {
          alert(rs.desc);
        }
        resolve(res.isFree);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    }
    processCrossAjax(ajaxSetting);
  })
};

//跳转状态
const toStatus = async (selector) => {
  $(selector).removeClass('d-none');
  $(selector).siblings('.status').addClass('d-none');
  $('#pop_start').addClass('d-none');
  $('.popup').hide() // 倒计时动画,充值弹出框隐藏
};

//根据空闲跳转状态
const handleFree = async () => {
  return new Promise(async (resolve, reject) => {
    let free = await isFree();
    if (free == 0) { //改为0
      await toStatus('#start');
    } else {
      await toStatus('#reserve');
    }
    resolve();
  })
};

//预约排队
const getReserve = async () => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/machineOperating/reservationQueuingOnMachineInfo?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: async (rs) => {
        console.log(rs);
        let res = rs.result;
        if (_SG.isReplyOk(rs)) {
          if (res.state == 0) {
            let free = await isFree();
            if (free == 0) {
              toStatus('#start');
              await $('#pop_start').removeClass('d-none');
              await countdown(10);
            } else {

            }
          } else {
            toStatus('#cancel');
            refreshPos();
          }
          resolve(res);
        } else {
          alert(rs.desc);
        }
      },
      error: (err) => {
        console.log(err);
        reject(err);
      },
    };
    processCrossAjax(ajaxSetting);
  })
}

//获取排队位置
const getQueuePos = async () => {
  return new Promise(async (resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/machineOperating/selectCurrentQueuingPositionByUserId?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: async function (rs) {
        console.log(rs);
        let res = rs.result,
          html = '';
        if (_SG.isReplyOk(rs)) {
          if (res.state != 0) {

            resolve(res);
          } else {
            console.log(res.message);
            alert(res.message);
          }
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err);
        reject(err);
      },
    }
    processCrossAjax(ajaxSetting);
  })
};

const refreshFree = async () => {
  return new Promise((resolve, reject) => {
    let interval = setInterval(async () => {
      let free = await isFree();
      if (free == 0) {
        await clearInterval(interval);
        await toStatus('#start');
        await $('#pop_start').removeClass('d-none');
        await countdown(10);
      }
    }, 3000)
  })
};
//刷新排队位置
const refreshPos = async () => {
  return new Promise((resolve, reject) => {
    let interval = setInterval(async () => {
      let res = await getQueuePos();
      let pos = res.message.slice(5, 6);
      console.log(pos);
      if (pos > 1) {
        $('.toWait').html(res.message);
      } else {
        await clearInterval(interval);
        await refreshFree();
      }
      resolve(pos);
    }, 7000)
  })
};


//开始游戏倒计时
const countdown = async (time) => {
  return new Promise(async (resolve, reject) => {
    let count = time;
    let interval = setInterval(async () => {
      await $('#countdown').html(count);
      await count--;
      console.log(count);
      if (count == 0 || isConfirmed) {
        await clearInterval(interval);
        await cancelReserve();
        await handleFree();
      }
      resolve(count);
    }, 1000)
  })
};


//取消预约排队
const cancelReserve = async () => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/machineOperating/cancelQueue?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: async (rs) => {
        console.log(rs);
        let res = rs.result;
        if (_SG.isReplyOk(rs)) {
          resolve(res.state);
        } else {
          alert(rs.desc);
        }
      },
      error: (err) => {
        console.log(err);
        reject(err);
      },
    }
    processCrossAjax(ajaxSetting);
  })
}


// 倒计时动画
var cutDownAni = function (i) {
  $('.cutDown').show()
  after(i)
}
function after(i){
  let pic
  switch (i) {
    case 4:
      pic = './img/cutdown/ready.png'
      break;
    case 3:
      pic = './img/cutdown/3s.png'
      break;
    case 2:
      pic = './img/cutdown/2s.png'
      break;
    case 1:
      pic = './img/cutdown/1s.png'
      break;
    default:
      break;
  }
  $('.time img').attr('src', pic)
  i=i-1
  if (i > -2) {
    setTimeout(function(){
      after(i);
    },1000);
  } else {
    $('.cutDown').hide()
  }
}

// 关闭充值弹框
$('.closed').on('click', ()=> {
  $('.recharge').hide()
})
$('.btn-giveup').on('click', ()=> {
  $('.recharge').hide()
})
//跳转到‘充值’
$('.charge_btn').on('click', () => {
  location.href = 'recharge.html';
});
$('.btn-charge').on('click', () => {
  location.href = 'recharge.html';
});

//跳转到‘记录’
$('.torecord').on('click', () => {
  location.href = 'gamerecord.html?id=' + id;
});

$(".showwawalogo").on('click', () => {
  location.href = 'rewardrecord.html?id=' + id;
})

//点击触发‘取消排队’
$('#cancel').on('click', async () => {
  await cancelReserve();
  await handleFree();
});

//点击触发‘预约排队’
$('#reserve').on('click', async () => {
  getReserve();
});

//点击‘确认’进入游戏
let isConfirmed = false;
$('#confirm').on('click', () => {
  isConfirmed = true;
  startGame();
})

//点击‘返回’取消排队
$('#giveUp').on('click', async () => {
  isConfirmed = true;
  await cancelReserve();
  await handleFree();
});

//点击触发‘开始抓取’
let entered = false;
$('#start').on('click', async () => {
  let free = await isFree();
  if (free == 0) {
    chargeMoney().then(res => { // 判断金币是否足够 足够往下走
      // console.log(res)
      if (res) {
        entered = true;
        moveHook(7);
        // 倒计时动画显示
        cutDownAni(4)
        setTimeout(function () {
          moveHook(6,'D8B04CC6B1ED')
          startGame();
          gameCountdown(40);
        }, 5000)
      } else {
        // alert('金币不足,请前去充值')
        $('.recharge').show()
      }
    })
  } else {
    handleFree();
  }
});

//进入游戏
const startGame = async () => {
  $('.catch_content,.controls,#pop_start').addClass('d-none');
  $('.playPanel').removeClass('d-none');
  let res = await startGrab();
  if (res.operatingTime) {
    let count = await gameCountdown(res.operatingTime);
  }
};
// 判断金币是否足够
const chargeMoney = async function () {
  let balance = $('#balance').html();
  let consumption = _SG.cache.getData('consumption');
  return new Promise ((resolve, reject) => {
    if (balance >= consumption) {
      // return true
      resolve(true)
    } else {
      // 金币不足前往充值页面
      resolve(false)
    } 
  })
}
//开始抓取
const startGrab = () => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/machineOperating/startGrabDoll?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: (rs) => {
        // console.log('start')
        // console.log(rs);
        if (_SG.isReplyOk(rs)) {
          resolve(rs);
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
};

//抓取操作倒计时
const gameCountdown = async (time) => {
  return new Promise(async (resolve, reject) => {
    gameOver = false
    let count = time;
    
    let interval = setInterval(async () => {
      await $('#gameCountdown').html(count);
      await $('#gameCountdown').removeClass('d-none');
      await count--;
      // console.log('gameOver'+gameOver)
      if (count == 2) {
        hookDown();
      } else if (count == 0 || gameOver) {
        clearInterval(interval);
        $('#gameCountdown').addClass('d-none')
      }
      resolve(count);
    }, 1000)
  })
};

//抓取操作
const play = async (direction,commandCode="") => {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/machineOperating/dollMachineOperation?operatingType=' + direction + '&commandCode='+commandCode,
      contentType: "application/json;charset=UTF-8",
      success: async (rs) => {
        if (_SG.isReplyOk(rs)) {

        } else {
          alert(rs.desc);
        }
        resolve(rs);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
};

//获取抓取结果
const getResult = function () {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/machineOperating/getMachineInfoCommodityResult?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: function (rs) {
        console.log(rs);
        if (_SG.isReplyOk(rs)) {
          
        } else {

        }
        resolve(rs);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
};


//关闭操作接口
const closeMachine = function () {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'get',
      url: _SG['apiPreUrl'] + '/machineOperating/closeMachineOperation?mcId=' + id,
      contentType: "application/json;charset=UTF-8",
      success: async function (rs) {
        // console.log(rs);
        let free = await isFree();
        if (free == 0) { //改为0
          $('#reserve,.playPanel').addClass('d-none')
          $('#start,.catch_content,.controls').removeClass('d-none')
          // 显示出抓取按钮时，去除加载等待
          // $.hideLoading()
        } else {
          $('#start,.playPanel').addClass('d-none')
          $('#reserve,.catch_content,.controls').removeClass('d-none');
          $('#reserve').on('click', function () {
            toQueue();
          });
          // 显示出抓取按钮时，去除加载等待
          $.hideLoading()
        }
        resolve(rs);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
};

const move = async (direction) => {
  await play(direction);
  setTimeout(function () {
    play(8);
  }, 2000);
};

const moveHook = async function (direction) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      move(direction);
      resolve();
    }, 0)
  })
};
let gameOver = false;
const hookDown = async () => {
  
  let capture = await play(5);
  gameOver = true;
  // let result = await finalResult();
  let close = await closeMachine();
};

const finalResult = async () => {
  return new Promise((resolve, reject) => {
    let i = 10;
    let interval = setInterval(async () => {
      let res = await getResult();
      i--;
      // console.log(res)
      if (res.code == '成功' || i == 0) {
        console.log(res.result);
        console.log(i);
        clearInterval(interval);
        resolve(res);
      }      
    }, 1000)
  })
};

//发送操作请求
$('.btn-up').on('click', async () => {
  await moveHook(1);
});
$('.btn-down').on('click', async () => {
  await moveHook(2);
});
$('.btn-left').on('click', async () => {
  await moveHook(3);
});
$('.btn-right').on('click', async () => {
  await moveHook(4);
});

$('.btn-go').on('click', async () => {
  $.showLoading("正在获取结果");
  getBalance()
  await hookDown();
});


//时间处理
function formatDateTime(timeMinute) {
  let result = "";
  if (timeMinute < 1) {
    result = "1分钟内";
  } else if (timeMinute < 60) {
    result = Math.floor(timeMinute) + "分钟前";
  } else if (timeMinute / 60 <= 24) {
    result = Math.floor(timeMinute / 60) + "小时前";
  } else {
    let timeMs = timeMinute * 60 * 1000;
    let today = new Date();
    let todayMs = today.getTime();
    let thenMs = todayMs - timeMs;
    let thenTime = new Date();
    thenTime.setTime(thenMs);
    let year = 0,
      month = 0,
      date = 0,
      hour = 0,
      minute = 0;
    year = thenTime.getFullYear();
    month = thenTime.getMonth() + 1;
    date = thenTime.getDate();
    hour = thenTime.getHours();
    minute = thenTime.getMinutes();
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
  }
  return result;
}

//获取围观人数
let token = _SG.user.getInfo().token;
var ws = new WebSocket('ws://120.77.83.200:8090/websocket/' + id + '/' + token);
ws.onmessage = function (evt) {
  let rsData = evt.data;
  if (rsData) {
    rsData = JSON.parse(rsData);
    if (rsData.code == 1) {
      // 成功抓到娃娃   
      $.hideLoading()
      $('.capture-success').show()
    } else if (rsData.code == 2) {
      // 没有抓到娃娃
      $.hideLoading()
      $('.capture-fail').show()
    }
  } else {
    rsData = null;
    return;
  }

  if (rsData.online) {
    $('#ol_amount').html(rsData['online'] + '人');
    let avatar = rsData['head'],
      html = '';
    $.each(avatar, (i, e) => {
      html += '<img class="icon_top_avatar d-block rounded-circle " src="' + e + '"/>';
    })
    $('#ol_avatar').html(html);
  }
};

$(".collectwawa .isnot").click(function () {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/collection/insertCollection?businessId=' + id + "&collectionType=2",
      contentType: "application/json;charset=UTF-8",
      success: (rs) => {
        if (_SG.isReplyOk(rs)) {
          resolve(rs);
          $.toast("收藏成功");
          $(".collectwawa .isok").show();
          $(".collectwawa .isnot").hide();
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
})

$(".collectwawa .isok").click(function () {
  return new Promise((resolve, reject) => {
    let ajaxSetting = {
      type: 'post',
      url: _SG['apiPreUrl'] + '/collection/deleteCollectionByBusinessId?businessIds=' + id + "&collectionType=2",
      contentType: "application/json;charset=UTF-8",
      success: (rs) => {
        if (_SG.isReplyOk(rs)) {
          resolve(rs);
          $.toast("取消收藏成功");
          $(".collectwawa .isok").hide();
          $(".collectwawa .isnot").show();
        } else {
          alert(rs.desc);
        }
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    };
    processCrossAjax(ajaxSetting);
  })
})
// 抓取成功弹出框相关操作的点击
// 关闭弹出框
$('.cap-close').click(function () {
  $('.popup').hide()
})
$('.relax').click(function () {
  $('.popup').hide()
})
// 点击再来一次
$('.onemore').click( async () => {
  gameOver = false
  $('.popup').hide()
  let free = await isFree();
  if (free == 0) {
    chargeMoney().then(res => { // 判断金币是否足够 足够往下走
      // console.log(res)
      if (res) {
        // entered = true;
        moveHook(7);
        // 倒计时动画显示
        cutDownAni(4)
        setTimeout(function () {
          moveHook(6,'D8B04CC6B1ED')
          startGame();
          gameCountdown(40);
        }, 5000)
      } else {
        // alert('金币不足,请前去充值')
        $('.recharge').show()
      }
    })
  } else {
    handleFree();
  }
})