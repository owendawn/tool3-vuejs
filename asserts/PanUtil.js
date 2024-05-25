PanData = {
    color: ["#2dc3e8", "#fb6e52", "#ffce55", "#a0d468", "#e75b8d", "#5793f3", "#E75B8D", "#fd9c35", "#dd4444", "#EDC240", "#d4df5a", "#5578c2", "#dd4d79", "#3D853D", "#9440ED", "#AFD8F8", "#CB4B4B", "#4DA74D", "#F35A5A", "#EDC240", "#BD9B33", "#8CACC6", "#7633BD", "#FFE84C", "#D2FFFF"],
    chineseMonth: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
};

PanUtil = {
    dateFormat: {
        format: function(date, pattern) {
            var date = date;
            if (isNaN(date.getTime()) || date.getTime() === new Date(null).getTime())
                return "~";
            var defaults = [
                { key: "yyyy", value: date.getFullYear() },
                { key: "yy", value: date.getYear() },
                { key: "MM", value: date.getMonth() + 1 },
                { key: "dd", value: date.getDate() },
                { key: "HH", value: date.getHours() },
                { key: "mm", value: date.getMinutes() },
                { key: "ss", value: date.getSeconds() },
                { key: "SSS", value: date.getMilliseconds() },
                {
                    key: "hh",
                    value: function(re, key, date) {
                        if (date.getHours() > 12) {
                            return re.replace("hh", ("00" + (date.getHours() - 12)).substring(2 + (date.getHours() - 12).toString().length - 2)) + " PM";
                        } else {
                            return re.replace("hh", ("00" + date.getHours()).substring(2 + date.getHours().toString().length - 2)) + " AM";
                        }
                    }
                }
            ];
            var returns = pattern;
            for (var i = 0; i < defaults.length; i++) {
                var it = defaults[i];
                if (pattern.indexOf(it.key) >= 0) {
                    if (typeof(it.value) === "function") {
                        var _f = it.value;
                        returns = _f(returns, it.key, date);
                    } else
                        returns = returns.replace(new RegExp(it.key, "g"), ("00" + it.value).substring(2 + it.value.toString().length - it.key.length));
                }
            }
            return returns;
        },
        parse: function(str, pattern) {
            var year = 1900,
                month = 0,
                day = 1,
                hours = 0,
                minutes = 0,
                seconds = 0,
                milliseconds = 0;
            if (pattern.indexOf("yyyy") >= 0) {
                year = Number(str.substr(pattern.indexOf("yyyy"), 4));
            } else if (pattern.indexOf("yy") >= 0) {
                year = Number(str.substr(pattern.indexOf("yy"), 2)) + 100 + 1900;
            }
            if (pattern.indexOf("MM") >= 0) {
                month = Number(str.substr(pattern.indexOf("MM"), 2)) - 1;
            }
            if (pattern.indexOf("dd") >= 0) {
                day = Number(str.substr(pattern.indexOf("dd"), 2));
            }
            if (pattern.indexOf("hh") >= 0) {
                hours = Number(str.substr(pattern.indexOf("hh"), 2)) + Number(str.indexOf("AM") >= 0 ? 0 : (str.indexOf("PM") >= 0 ? 12 : 0));
            }
            if (pattern.indexOf("HH") >= 0) {
                hours = Number(str.substr(pattern.indexOf("HH"), 2));
            }
            if (pattern.indexOf("mm") >= 0) {
                minutes = Number(str.substr(pattern.indexOf("mm"), 2));
            }
            if (pattern.indexOf("ss") >= 0) {
                seconds = Number(str.substr(pattern.indexOf("ss"), 2));
            }
            if (pattern.indexOf("SSS") >= 0) {
                milliseconds = Number(str.substr(pattern.indexOf("SSS"), 3));
            }
            var _re = new Date(year, month, day, hours, minutes, seconds, milliseconds);
            return isNaN(_re) && "~" || _re;
        },
        toTimeFormatter:function(milliseconds,pattern){
    		var defaults = [
                { key: "dd", value: Math.floor(milliseconds/24/60/60/1000) },
                { key: "HH", value: Math.floor(milliseconds%(24*60*60*1000)/60/60/1000) },
                { key: "mm", value: Math.floor(milliseconds%(60*60*1000)/60/1000) },
                { key: "ss", value: Math.floor(milliseconds%(60*1000)/1000) },
                { key: "SSS", value: milliseconds%1000 }
            ];
            var returns = pattern;
            for (var i = 0; i < defaults.length; i++) {
                var it = defaults[i];
                if (pattern.indexOf(it.key) >= 0) {
                    if (typeof(it.value) === "function") {
                        var _f = it.value;
                        returns = _f(returns, it.key, date);
                    } else
                        returns = returns.replace(new RegExp(it.key, "g"), ("00" + it.value).substring(2 + it.value.toString().length - it.key.length));
                }
            }
            return returns;
    	},
    },
     ajax:{
        get: function (url,data,callback,preConfig){
            var obj=new XMLHttpRequest(); 
            obj.open('GET',url,true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); 
            preConfig&&preConfig(obj);
            if(data&&Object.getOwnPropertyNames(data).length>0){
                if(url.indexOf("?")<0){
                    url+="?";
                }
                for(var k in data){
                    url+=k+"="+encodeURIComponent(data[k]);
                }
            }
            obj.onreadystatechange=function(){
                if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { 
                    callback.call(this, JSON.parse(obj.responseText),obj);
                }
            };
            obj.send(null);
        },
        post: function (url, data, callback,preConfig) {
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); 
            preConfig&&preConfig(obj);
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) { 
                    callback.call(this, JSON.parse(obj.responseText),obj);
                }
            };
            obj.send(PanUtil.parseObjectToFormData(data));
        }
    },
    jsonp: function(url,data,succ,jsonpName) {
    	jsonpName=jsonpName||"callback";
		var _s=document.createElement("script");
        var cfn="panutil_"+new Date().getTime();
        window[cfn]=function(d){
           succ(d);
        }
        if(url.indexOf("?")<0){
        	url+="?";
        }
        _s.src=url+"&"+jsonpName+"="+cfn+"&"+this.parseObjectToFormData(data);
        document.body.appendChild(_s);
    },
    jsonPostMessage:function(url,data,succ){
        var _s=document.createElement("iframe");
        _s.style="height:0"
        var cfn="panutil_"+new Date().getTime();
        window.addEventListener("message", function(e){
            var data=JSON.parse(e.data)
            console.log(data)
            if(data.type==="PanPostMessage"&&data.panpostmsgid===cfn){
                succ(data.data,data,e)
            }
        }, false);
        if(url.indexOf("?")<0){
        	url+="?";
        }
        _s.src=url+"&panpostmsgid="+cfn+"&"+this.parseObjectToFormData(data);
        document.body.appendChild(_s);
    },
    iframePostMessage:function(type,url,data,succ){
        var cfn="paniframe_"+new Date().getTime();
        var _call=function(e){
            var data=JSON.parse(e.data)
            // console.log(data)
            if(data.type==="PanIframe"&&data.paniframeid===cfn){
                succ(data.result,data)
                window.removeEventListener("message", _call);
            }
        }
        window.addEventListener("message", _call, false);
        window.parent.postMessage(JSON.stringify({
            type:"PanIframe",
            paniframeid:cfn,
            url:url,
            method:type,
            data:data
        }), '*');
    },
    //url参数解析
    getURLSearchParams: function() {
        if (window.location.search == "") {
            return {};
        }
        var search = window.location.search.trim().substring(1);
        while (true) {
            if (search.lastIndexOf('#') == search.length - 1) {
                search = search.substr(0, search.length - 1);
            } else {
                break;
            }
        }
        var strs = search.split("&");
        var o = {};
        for (var i = 0; i < strs.length; i++) {
            var it = strs[i].split("=");
            o[it[0].toString()] = it[1];
        }
        return o;
    },
    //将null或undefined转为“”
    parseNull: function(data, replace, unit) {
        replace = replace || "";
        return data === null || data === undefined || data === "" ? replace : data + (unit ? unit : "");
    },
    getScreen: function() {
        var winWidth = -1,
            winHeight = -1;
        //获取窗口宽度
        if (window.innerWidth)
            winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            winWidth = document.body.clientWidth;
        //获取窗口高度
        if (window.innerHeight)
            winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            winHeight = document.body.clientHeight;
        //通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth;
        }
        return {
            winHeight: winHeight,
            winWidth: winWidth
        };
    },
    clearnForm: function(dom) {
        if (dom && dom.tagName === "FORM") {
            dom.reset();
            var _selects = dom.getElementsByTagName("select");
            for (var i = 0; i < _selects.length; i++) {
                if (_selects[i].getElementsByTagName("option")[0])
                    _selects[i].getElementsByTagName("option")[0].selected = true;
            }
            var _inputs = dom.getElementsByTagName("input");
            for (var i = 0; i < _inputs.length; i++) {
                if (_inputs[i].type == "checkbox")
                    _inputs[i].checked = false;
            }
        }
    },
    parseFormDataToObject: function(str) {
        var reobj = {},
            _its = str.trim().split("&");
        for (var i = 0; i < _its.length; i++) {
            var o = _its[i];
            if (o !== "") {
                var __os = _its[i].split("=");
                reobj[__os[0]] = decodeURIComponent(__os[1]);
            }
        }
        return reobj;
    },
    parseObjectToFormData: function(obj) {
    	if(!obj){
    		return "";
    	}
        var search = "";
        for (var k in obj) {
            search += "&" + k + "=" + encodeURIComponent(obj[k]);
        }
        return search.substring(1);
    },
    serializeObj: function(dom) {
        var ps = {};
        dom.querySelectorAll("input,select,checkbox:checked,radio:checked").forEach(function(it, idx, all) {
            var name = it.getAttribute("name");
            if (name) {
                ps[name.trim()] = it.value;
            }
        });
        return ps;
    },
    serialize: function(dom) {
        var _obj = this.serializeObj(dom);
        return this.parseObjectToFormData(_obj);
    },
    isMobile: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"
        ];
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                return true;
            }
        }
        return false;
    },
    hashcode: function(str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
    formatShortNumber:function(num,length){
        var end=1;
        for (var i = 0; i < length||0; i++) {
            end*=10;
        }
        if(num>1000*1000*1000){
            return Math.round(num/(1000*1000*1000)*end)/end+"G";
        }else if(num>1000*1000){
            return Math.round(num/(1000*1000)*end)/end+"M";
        }else if(num>1000){
            return Math.round(num/(1000)*end)/end+"K";
        }else{
            return Math.round(num*end)/end+"B";
        }
    },
    decodeValue:function(data){
        if(arguments.length>1){
            var map={};
            for (var i = 1; i <arguments.length ; i=i+2) {
                if(i+1<arguments.length){
                    map[arguments[i]]=arguments[i+1];
                }
            }
            if(arguments.length%2===0){
                if(map[data]){
                    return map[data];
                }else{
                    return arguments[arguments.length-1];
                }
            }else{
                if(map[data]){
                    return map[data];
                }else{
                    return data;
                }
            }
        }else{
            return data;
        }
    }
};