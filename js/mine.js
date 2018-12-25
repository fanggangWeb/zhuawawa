//个人基本信息
const id = getParamFromUrl('id');
console.log(id);
processCrossAjax({
    type: 'get',
    url: _SG['apiPreUrl']+'/user/userBasic?id='+id,
    contentType: "application/json;charset=UTF-8",
    success: function(rs) {
        if(_SG.isReplyOk(rs)){
            let res=rs.result;
            console.log(res);
            let html='<img class="rounded-circle" src="'+res.headPicUrl+'">\n'
                +'<div class="username">'+ res.nickName+'</div>';
            $('.avatar').html(html)
        } else{
            alert(rs.desc);
        }
    },
    error: function(err) {
        console.log(err)
    }
});

//账户余额
processCrossAjax({
    type: 'post',
    url: _SG['apiPreUrl']+'/home/selectUserBasicOnCount',
    contentType: "application/json;charset=UTF-8",
    success: function(rs) {
        if(_SG.isReplyOk(rs)){
            let res=rs.result;
            _SG.cache.setData('res',res);
            console.log(res);
            var htmlindex = $('#detail').html();
            let html= '<div class="my_doll d-inline-block d-inline-flex">'
                +'<i class="icon_my_doll"></i>'
                +'<div class="d-inline-block mr-auto">娃娃</div>'
                +'<div class="d-inline-block">'+res[3].balance+'</div>'
                +'<i class="icon_expand"></i>'
                +'</div>'
                +'<div class="my_coin d-inline-block d-inline-flex">'
                +'<i class="icon_my_coin"></i>'
                +'<div class="d-inline-block mr-auto">娃娃币</div>'
                +'<div class="d-inline-block">'+res[0].balance+'</div>'
                +'<i class="icon_expand"></i>'
                +'</div>'
                +'<div class="my_bill d-inline-block d-inline-flex">'
                +'<i class="icon_my_bill"></i>'
                +'<div class="d-inline-block mr-auto">娃娃币账单</div>'
                +'<div class="d-inline-block"></div>'
                +'<i class="icon_expand"></i>'
                +'</div>';
            $('#detail').html(html);
            $('#detail').append(htmlindex);
            toCollection();
            toRecharge();
            torRecord();
            $('.my_collect').on('click', function () {
			    location.href = 'mycollect.html';
			});
			$('.my_address').on('click', function () {
        sessionStorage.setItem('chooseAddType', 0)
			  location.href = 'addresslist.html?id='+id;
			});
			$('.my_opinion').on('click', function () {
			    location.href = 'feedback.html';
      });
      $('.my_coupons').on('click', function () {
        location.href = 'coupon.html';
      });
        } else{
            alert(rs.desc);
        }
    },
    error: function(err) {
        console.log(err)
    }
})

const toCollection = function () {
    $('.my_doll').on('click', function () {
        location.href = 'my_collection.html?id=' + id;
    });
}
const toRecharge = function () {
    $('.my_coin').on('click', function () {
        location.href = 'recharge.html?id=' + id;
    });
}
const torRecord = function () {
    $('.my_bill').on('click', function () {
        location.href = 'recharge_record.html?id=' + id;
    });
}
