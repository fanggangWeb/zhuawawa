
const id = getParamFromUrl('id');
console.log(id);

//获取我的娃娃
processCrossAjax({
    type:'post',
    url:_SG['apiPreUrl']+'/user/selectCatchRecordList?num=1&size=100',
    contentType:"application/json;charset=UTF-8",
    success:function (rs) {
        console.log(rs);
        let res = rs.result.list,
            html = '',
            _html = '';
        if(_SG.isReplyOk(rs)){
            _html = '<div class="catch_detail">已抓中'+rs.result.total+'次</div>';
            $('.dolls_amount').append(_html);
            $.each(res,(i,e)=>{
                html+='<div class="doll rounded-3">'
                    +'<img class="w-100 rounded-top-3" src="'+e.commodityPicId+'"/>'
                    +'<div class="doll_info d-flex flex-column content-even">'
                    +'<div class="doll_name">'+e.commodityName+'</div>'
                    +'<div class="d-flex">'
                    +'<div class="d-flex">'
                    +'<img class="d-block icon_coin align-self-center" src="img/icon_my_coin.png">'
                    +'</div>'
                    +'<span class="mr-auto unit_price align-self-baseline">'+e.unitPrice+'/次</span>'
                    +'<span class="deliver_status align-self-baseline">'+e.isSend+'</span>'
                    +'</div>'
                    +'</div>'
                    +'</div>';
            });
            $('.my_dolls').html(html);
        }else{
            alert(rs.desc)
        }
    }
})