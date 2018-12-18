var _SG = {
	// "apiPreUrl": "http://120.77.83.200:8088",
	"apiPreUrl": "http://120.77.83.200:8090",
	"isReplyOk": function(rs) {
		if (rs.code == "rest.success") {
			return true;
		}else if(rs.code=="user is null"){
      _SG.user.clearInfo();
      $.toast("token过期，请重新进入进行授权登录", "forbidden");
			// alert("token过期，请重新进入进行授权登录");
		}
		return false;
	},
	"event": {
		"getEvent": function(e){
			var e = window.event || e;
			return e;
		},
		"stopSpread": function(e){
			var e = this.getEvent(e);
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
		},
		"preventDefault": function(e){
			var e = this.getEvent(e);
			if(e.preventDefault){
				e.preventDefault();
			}
		}
	},
	"cache": {
		setData: function(key, val) {
			var str = JSON.stringify({'data': val});
			localStorage.setItem(key, str);
		},
		getData: function(key) {
			var data = localStorage.getItem(key);
			if (data != null) {
				return (JSON.parse(data)).data;
			} else {
				return null;
			}
		},
		removeData: function(key) {
			localStorage.removeItem(key);
		}
	},
	"user": {
		setInfo: function(c) {
			// c为对象(包含token)
			_SG['cache'].setData('userInfo', c);
		},
		clearInfo: function() {
			_SG['cache'].removeData('userInfo');
		},
		getInfo: function() {
			return _SG['cache'].getData('userInfo');
		},
	},
}
// 处理跨域Ajax请求
function processCrossAjax(opts) {
	// opts['xhrFields'] = {withCredentials: true};
	// opts['crossDomain'] = true;
	var c = _SG['user'].getInfo();
	if(c != null && c['token']) {
		opts['headers'] = {"access-token": c['token']};
	}	
	return $.ajax(opts);
}

//解析地址参数
function getParamFromUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
