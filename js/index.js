
//获取轮播图片；
processCrossAjax({
    type: 'get',
    url: _SG['apiPreUrl']+'/home/selectBannerListOnBannerType?bannerType=1',
    contentType: "application/json;charset=UTF-8",
    success: function(rs) {
        console.log(rs);
        if(_SG.isReplyOk(rs)){
            let res=rs.result;
            let html = '';
            let html_li = '';
            $.each(res,(i,e)=>{
                if(i != 0){
                    html+='<a href="bannerdetail.html" class="carousel-item">\n' +
                        ' <img id="banner_'+i+'" src="'+'http://'+e.realUrlPath+'" class="d-block w-100">\n' +
                        '</a>';
                    html_li+='<li data-target="#carouselExampleIndicators" data-slide-to="'+i+'"></li>';
                }else {
                    html+='<a href="bannerdetail.html" class="carousel-item active">\n' +
                        ' <img id="banner_'+i+'" src="'+'http://'+e.realUrlPath+'" class="d-block w-100">\n' +
                        '</a>';
                    html_li+='<li data-target="#carouselExampleIndicators" data-slide-to="'+i+'" class="active"></li>';
                }
            })
            $('.carousel-inner').html(html)
            $('.carousel-indicators').html(html_li);
        } else{
            alert(rs.desc);
        }
    },
    error: function(error) {
        console.log(error)
    }
})

//项目切换；
const columnSwitch =function () {
    $('#nav ul li').on('click',function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        let subjectId =$(this).find('a').attr('id').toString().slice(4);
        getMachineInfos(subjectId);
    })
}

//进入娃娃机；
const selectMachine = function() {
    $('.machine').on('click', function () {
        let mcId = $(this).find('img').attr('id').slice(0);
            location.href = 'playGame.html?mcId=' + mcId;
    })
}

//根据项目展示娃娃机；
const getMachineInfos = function(subjectCategoryId){
   processCrossAjax({
        type: 'post',
        url: _SG['apiPreUrl'] + '/home/selectMachineInfoList?num=1&size=10&subjectCategoryId=' + subjectCategoryId,
        contentType: "application/json;charset=UTF-8",
        success: function (rs) {
            let html = '';
            let html_2 = '';
            if (_SG.isReplyOk(rs)) {
                let res = rs.result.list;
                $.each(res, function (j, k) {
                    let free = k.isFree,
                        statusDesc = '',
                        statusClass='';
                    if (free == 0) {
                        statusClass = 'bg-free';
                        statusDesc = '空闲中';
                    } else {
                        statusClass = 'bg-busy';
                        statusDesc = '热抓中';
                    }
                    html += '<div class="machine flex-column">' +
                        '<img class="" id="' + k.id + '" src="http://' + k.realFilePath + '"/>' +
                        '<div class="d-flex">' +
                        '<div class="d-flex my-2">' +
                        '<img class=" icon_coin align-self-center ml-2" src="img/icon_my_coin.png">' +
                        '</div><div class="cl_y align-self-center ml-2">'+k.consumption+' 币 / 次</div></div>' +
                        '<div class="ml-2 fb">'+k.machineName+'</div>' +
                        '<div class="d-flex m-auto status '+statusClass+'">'+statusDesc+'</div>' +
                        '</div>';
                });
                html_2 =
                    '<div id="content_'+subjectCategoryId+'" class="img-container flex justify-content-between flex-wrap">'+
                    html +
                    '</div>';
                $('#machines').html(html_2);
                selectMachine();
            } else {
                alert(rs.desc);
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

//获取项目列表；
processCrossAjax({
    type: 'get',
    url: _SG['apiPreUrl']+'/home/subjectCategoryList?num=1&size=10&columnType=2',
    contentType: "application/json;charset=UTF-8",
    success: function(rs) {
        console.log(rs);
        if(_SG.isReplyOk(rs)){
            let res=rs.result.list;
            let html = '';
            $.each(res,(i,e)=>{
                if(i != 0){
                    html+='<li class="nav-item">\n'+
                        '<a class="nav-link" id="nav_'+e.id+'" href="#">'+e.columnName+'</a>\n'
                        +'</li>';
                }else {
                    html+='<li class="nav-item active">\n'+
                        '<a class="nav-link" id="nav_'+e.id+'" href="#">'+e.columnName+'</a>\n'
                        +'</li>';
                }
            getMachineInfos(e.id);
            });
            $('#nav ul').html(html);
            columnSwitch();
        } else{
            alert(rs.desc);
        }
    },
    error: function(err) {
        console.log(err)
    }
})

//跳转到‘我的’；
$('#index_mine').on('click',function () {
   let id =  _SG['user'].getInfo().id;
   location.href = 'mine.html?id='+id;
})

