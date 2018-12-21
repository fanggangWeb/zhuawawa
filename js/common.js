apiHost = 'http://120.77.83.200:8088';

const TYPE =  {
    "post":"POST",
    "get":"GET",
    "put":"PUT",
    "delete":"DELETE"
};
function getParamFromUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    console.log(r);
    if (r != null) return decodeURI(r[2]);
    return null;
}
function parseQueryString(param){
    let peddingString = "";
    for (let key in param){
        peddingString += key + "=" + param[key] + "&"
    }
    if(peddingString.length > 0){
        peddingString = peddingString.substring(0, peddingString.length - 1);
    }
    return peddingString;
}
const _ajax = (contentType,type,url,data,succ,failed)=>{
    $.ajax({
        type: type,
        url: apiHost+url,
        data: data,
        contentType: contentType,
        success: function(data) {
            if(typeof(succ)==="function"){
                if(data.code === "rest.success"){
                    succ(data);
                }else{
                    if(failed){
                        console.log(data.desc);
                    }else{

                    }
                }
            }else{
                console.log("the method is no a function!");
            }
        },
        error: function(error) {
            if(typeof(failed)==="function"){
                failed(error);
            }else{
                console.log("the method is no a function!");
            }
        }
    });
};
const _upload = (type,url,data,succ,failed)=>{
    $.ajax({
        url: url,
        type: type,
        data: data,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if(typeof(succ)==="function"){
                return succ(data);
            }else{
                console.log("the method is no a function!");
            }
        },
        error: function(error) {
            if(typeof(failed)==="function"){
                failed(error);
            }else{
                console.log("the method is no a function!");
            }
        }
    });

}
const AJAX =  {
    get(url,data,succ,failed){
        const pendingString = parseQueryString(data);
        url += pendingString === ""?"":"&queryString="+pendingString;
        return _ajax("application/json",TYPE.get,url,'',succ,failed);
    },
    post(url,data,succ,failed){
        return _ajax("application/json",TYPE.post,url,JSON.stringify(data),succ,failed);
    },
    put(url,data,succ,failed){
        return _ajax("application/json",TYPE.put,url,JSON.stringify(data),succ,failed);
    },
    delete(url,succ,failed){
        return _ajax("application/json",TYPE.delete,url,{},succ,failed);
    },
    deleteByObj(url,data,succ,failed){
        return _ajax("application/json",TYPE.delete,url,JSON.stringify(data),succ,failed);
    },
    upload(url,data,succ,failed){
        return _upload(TYPE.post,UploadHost+url,data,succ,failed)
    },
    uploadFromNodejs(url,data,succ,failed){
        return _upload(TYPE.post,apiHost+url,data,succ,failed)
    },
    importUser(url,data,succ,failed){
        return _upload(TYPE.post,apiHost+url,data,succ,failed)
    }
};
