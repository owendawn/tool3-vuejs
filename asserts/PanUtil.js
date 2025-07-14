var PanData = {
    color: ["#2dc3e8", "#fb6e52", "#ffce55", "#a0d468", "#e75b8d", "#5793f3", "#E75B8D", "#fd9c35", "#dd4444", "#EDC240", "#d4df5a", "#5578c2", "#dd4d79", "#3D853D", "#9440ED", "#AFD8F8", "#CB4B4B", "#4DA74D", "#F35A5A", "#EDC240", "#BD9B33", "#8CACC6", "#7633BD", "#FFE84C", "#D2FFFF"],
    chineseMonth: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
};

var PanUtil = {
    dateFormat: {
        format: function (date, pattern) {
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
                    value: function (re, key, date) {
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
                    if (typeof (it.value) === "function") {
                        var _f = it.value;
                        returns = _f(returns, it.key, date);
                    } else
                        returns = returns.replace(new RegExp(it.key, "g"), ("00" + it.value).substring(2 + it.value.toString().length - it.key.length));
                }
            }
            return returns;
        },
        parse: function (str, pattern) {
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
        toTimeFormatter: function (milliseconds, pattern) {
            var defaults = [
                { key: "dd", value: Math.floor(milliseconds / 24 / 60 / 60 / 1000) },
                { key: "HH", value: Math.floor(milliseconds % (24 * 60 * 60 * 1000) / 60 / 60 / 1000) },
                { key: "mm", value: Math.floor(milliseconds % (60 * 60 * 1000) / 60 / 1000) },
                { key: "ss", value: Math.floor(milliseconds % (60 * 1000) / 1000) },
                { key: "SSS", value: milliseconds % 1000 }
            ];
            var returns = pattern;
            for (var i = 0; i < defaults.length; i++) {
                var it = defaults[i];
                if (pattern.indexOf(it.key) >= 0) {
                    if (typeof (it.value) === "function") {
                        var _f = it.value;
                        returns = _f(returns, it.key, date);
                    } else
                        returns = returns.replace(new RegExp(it.key, "g"), ("00" + it.value).substring(2 + it.value.toString().length - it.key.length));
                }
            }
            return returns;
        },
    },
    ajax: {
        get: function (url, paramsMap, callback, preConfig) {
            var obj = new XMLHttpRequest();
            if (url.indexOf("?") < 0) {
                url += "?";
            }
            url += PanUtil.parseObjectToFormData(paramsMap);
            obj.open('GET', url, true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            preConfig && preConfig(obj);
            obj.onreadystatechange = function () {
                if (obj.readyState === 4 && obj.status === 200 || obj.status === 304) {
                    var json = NaN
                    try {
                        json = JSON.parse(obj.responseText)
                    } catch (e) {
                        console.error(e)
                    }
                    callback.call(this, json, obj);
                }
            };
            obj.send(null);
        },
        postForm: function (url, paramsMap, callback, preConfig) {
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            preConfig && preConfig(obj);
            obj.onreadystatechange = function () {
                if (obj.readyState === 4 && (obj.status === 200 || obj.status === 304)) {
                    var json = NaN
                    try {
                        json = JSON.parse(obj.responseText)
                    } catch (e) {
                        console.error(e)
                    }
                    callback.call(this, json, obj);
                }
            };
            obj.send(PanUtil.parseObjectToFormData(paramsMap));
        },
        postJson: function (url, paramsMap, callback, preConfig) {
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            preConfig && preConfig(obj);
            obj.onreadystatechange = function () {
                if (obj.readyState === 4 && (obj.status === 200 || obj.status === 304)) {
                    var json = NaN
                    try {
                        json = JSON.parse(obj.responseText)
                    } catch (e) {
                        console.error(e)
                    }
                    callback.call(this, json, obj);
                }
            };
            obj.send(JSON.stringify(paramsMap));
        }
    },
    ajaxPromise: {
        get: function (url, paramsMap, preConfig) {
            return new Promise(function (resolve, reject) {
                var obj = new XMLHttpRequest();
                if (url.indexOf("?") < 0) {
                    url += "?";
                }
                url += PanUtil.parseObjectToFormData(paramsMap);
                obj.open('GET', url, true);
                obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                preConfig && preConfig(obj);
                obj.onreadystatechange = () => {
                    if (obj.readyState === 4 && obj.status === 200 || obj.status === 304) {
                        var json = NaN
                        try {
                            json = JSON.parse(obj.responseText)
                        } catch (e) {
                            console.error(e)
                        }
                        resolve(json, obj);
                    }
                };
                obj.onerror = () => {
                    reject(obj)
                }
                obj.send(null);
            })
        },
        postForm: function (url, paramsMap, preConfig) {
            return new Promise(function (resolve, reject) {
                var obj = new XMLHttpRequest();
                obj.open("POST", url, true);
                obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                preConfig && preConfig(obj);
                obj.onreadystatechange = () => {
                    if (obj.readyState === 4 && obj.status === 200 || obj.status === 304) {
                        var json = NaN
                        try {
                            json = JSON.parse(obj.responseText)
                        } catch (e) {
                            console.error(e)
                        }
                        resolve(json, obj);
                    }
                };
                obj.onerror = () => {
                    reject(obj)
                }
                obj.send(PanUtil.parseObjectToFormData(paramsMap));
            })
        },
        postJson: function (url, paramsMap, preConfig) {
            return new Promise(function (resolve, reject) {
                var obj = new XMLHttpRequest();
                obj.open("POST", url, true);
                obj.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                preConfig && preConfig(obj);
                obj.onreadystatechange = () => {
                    if (obj.readyState === 4 && obj.status === 200 || obj.status === 304) {
                        var json = NaN
                        try {
                            json = JSON.parse(obj.responseText)
                        } catch (e) {
                            console.error(e)
                        }
                        resolve(json, obj);
                    }
                };
                obj.onerror = () => {
                    reject(obj)
                }
                obj.send(JSON.stringify(paramsMap));
            })
        }
    },
    jsonp: function (url, data, succ, jsonpName) {
        jsonpName = jsonpName || "callback";
        var _s = document.createElement("script");
        var cfn = "panutil_" + new Date().getTime();
        window[cfn] = function (d) {
            succ(d);
        }
        if (url.indexOf("?") < 0) {
            url += "?";
        }
        _s.src = url + "&" + jsonpName + "=" + cfn + "&" + this.parseObjectToFormData(data);
        document.body.appendChild(_s);
    },
    jsonPostMessage: function (url, data, succ) {
        var _s = document.createElement("iframe");
        _s.style = "height:0"
        var cfn = "panutil_" + new Date().getTime();
        window.addEventListener("message", function (e) {
            var data = JSON.parse(e.data)
            console.log(data)
            if (data.type === "PanPostMessage" && data.panpostmsgid === cfn) {
                succ(data.data, data, e)
            }
        }, false);
        if (url.indexOf("?") < 0) {
            url += "?";
        }
        _s.src = url + "&panpostmsgid=" + cfn + "&" + this.parseObjectToFormData(data);
        document.body.appendChild(_s);
    },
    iframePostMessage: function (type, url, data, succ) {
        var cfn = "paniframe_" + new Date().getTime();
        var _call = function (e) {
            var data = JSON.parse(e.data)
            // console.log(data)
            if (data.type === "PanIframe" && data.paniframeid === cfn) {
                succ(data.result, data)
                window.removeEventListener("message", _call);
            }
        }
        window.addEventListener("message", _call, false);
        window.parent.postMessage(JSON.stringify({
            type: "PanIframe",
            paniframeid: cfn,
            url: url,
            method: type,
            data: data
        }), '*');
    },
    //url参数解析
    getURLSearchParams: function () {
        if (window.location.search === "") {
            return {};
        }
        var search = window.location.search.trim().substring(1);
        while (true) {
            if (search.lastIndexOf('#') === search.length - 1) {
                search = search.substr(0, search.length - 1);
            } else {
                break;
            }
        }
        var strs = search.split("&");
        var o = {};
        for (var i = 0; i < strs.length; i++) {
            var it = strs[i].indexOf("=");
            if (it === '') {
                continue;
            }
            if (it <= -1) {
                o[strs[i]] = "";
            }
            o[strs[i].substr(0, it)] = decodeURIComponent(strs[i].substr(it + 1))
        }
        return o;
    },
    //将null或undefined转为“”
    parseNull: function (data, replace, unit) {
        replace = replace || "";
        return data === null || data === undefined || data === "" ? replace : data + (unit ? unit : "");
    },
    getScreen: function () {
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
    clearnForm: function (dom) {
        if (dom && dom.tagName === "FORM") {
            dom.reset();
            var _selects = dom.getElementsByTagName("select");
            for (var i = 0; i < _selects.length; i++) {
                if (_selects[i].getElementsByTagName("option")[0])
                    _selects[i].getElementsByTagName("option")[0].selected = true;
            }
            var _inputs = dom.getElementsByTagName("input");
            for (var i = 0; i < _inputs.length; i++) {
                if (_inputs[i].type === "checkbox")
                    _inputs[i].checked = false;
            }
        }
    },
    parseFormDataToObject: function (str) {
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
    parseObjectToFormData: function (obj) {
        if (!obj) {
            return "";
        }
        var search = "";
        for (var k in obj) {
            search += "&" + k + "=" + encodeURIComponent(obj[k] || '');
        }
        return search.substring(1);
    },
    serializeObj: function (dom) {
        var ps = {};
        dom.querySelectorAll("input,select,checkbox:checked,radio:checked").forEach(function (it, idx, all) {
            var name = it.getAttribute("name");
            if (name) {
                ps[name.trim()] = it.value;
            }
        });
        return ps;
    },
    serialize: function (dom) {
        var _obj = this.serializeObj(dom);
        return this.parseObjectToFormData(_obj);
    },
    isMobile: function () {
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
    hashcode: function (str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
    formatShortNumber(num, length) {
        var end = 1;
        for (var i = 0; i < length || 0; i++) {
            end *= 10;
        }
        if (num > 1000 * 1000 * 1000) {
            return Math.round(num / (1000 * 1000 * 1000) * end) / end + "G";
        } else if (num > 1000 * 1000) {
            return Math.round(num / (1000 * 1000) * end) / end + "M";
        } else if (num > 1000) {
            return Math.round(num / (1000) * end) / end + "K";
        } else {
            return Math.round(num * end) / end + "B";
        }
    },
    decodeValue: function (data) {
        if (arguments.length > 1) {
            var map = {};
            for (var i = 1; i < arguments.length; i = i + 2) {
                if (i + 1 < arguments.length) {
                    map[arguments[i]] = arguments[i + 1];
                }
            }
            if (arguments.length % 2 === 0) {
                if (map[data]) {
                    return map[data];
                } else {
                    return arguments[arguments.length - 1];
                }
            } else {
                if (map[data] !== undefined) {
                    return map[data];
                } else {
                    return data;
                }
            }
        } else {
            return data;
        }
    },
    _escape: function (value) {
        const text = String(value);
        if (!text.length)
            return text;
        const skip = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./,';
        let buffer = '';
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (skip.indexOf(char) < 0) {
                const ord = text.charCodeAt(i);
                char = ord < 256 ? '%' + ('00' + ord.toString(16)).toUpperCase().slice(-2) : '%u' + ('0000' + ord.toString(16)).toUpperCase().slice(-4);
            }
            buffer += char;
        }
        return buffer;
    },

    _unescape: function (value) {
        const text = String(value),
            len = text.length;
        if (!len)
            return text;
        let buffer = '',
            k = 0;
        while (k < len) {
            let char = text[k];
            if (char === '%') {
                let chars = k <= (len - 6) && text[k + 1] === 'u' ? text.substring(k + 2, k + 6) : k <= (len - 3) ? text.substring(k + 1, k + 3) : '';
                if (!/^[0-9A-F]+$/i.test(chars)) chars = '';
                if (chars.length === 4) {
                    char = String.fromCharCode(parseInt(chars, 16));
                    k += 5;
                } else if (chars.length === 2) {
                    char = String.fromCharCode(parseInt('00' + chars, 16));
                    k += 2;
                }
            }
            buffer += char;
            k += 1;
        }
        return buffer;
    },
    chineseToUnicode: function (chineseStr) {
        if (chineseStr === '') {
            return
        }
        var txt = this._escape(chineseStr)
            .toLocaleLowerCase()
            .replace(/%u/gi, "\\u");
        //var txt= escape(str).replace(/([%3F]+)/gi,'\\u');
        return txt
            .replace(/%7b/gi, "{")
            .replace(/%7d/gi, "}")
            .replace(/%3a/gi, ":")
            .replace(/%2c/gi, ",")
            .replace(/%27/gi, "'")
            .replace(/%22/gi, '"')
            .replace(/%5b/gi, "[")
            .replace(/%5d/gi, "]")
            .replace(/%3D/gi, "=")
            .replace(/%20/gi, " ")
            .replace(/%3E/gi, ">")
            .replace(/%3C/gi, "<")
            .replace(/%3F/gi, "?")
            .replace(/%5c/gi, "\\"); //
    },
    unicodeToChinese: function (unicodeStr) {
        if (unicodeStr === '') {
            return
        }
        return this._unescape(unicodeStr.replace(/\\u/gi, "%u"));
    },
    strToUtf8Bytes: function (str) {
        var result = new Array();
        var k = 0;
        for (var i = 0; i < str.length; i++) {
            var j = encodeURI(str[i]);
            if (j.length == 1) {
                // 未转换的字符
                result[k++] = j.charCodeAt(0);
            } else {
                // 转换成%XX形式的字符
                var bytes = j.split("%");
                for (var l = 1; l < bytes.length; l++) {
                    result[k++] = parseInt("0x" + bytes[l]);
                }
            }
        }
        return result;
    },
    utf8BytesToStr: function (bytes) {
        const utf8Array = new Uint8Array(bytes); // "Hello"
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(utf8Array);
    },
    str2LuanMa: function (str_u) {
        // 将字符串转换为乱码
        function string2unicode(str) {
            var ret = "";
            var ustr = "";
            for (var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i);
                var code16 = code.toString(16);
                if (code < 0xf) {
                    ustr = "\\u" + "000" + code16;
                } else if (code < 0xff) {
                    ustr = "\\u" + "00" + code16;
                } else if (code < 0xfff) {
                    ustr = "\\u" + "0" + code16;
                } else {
                    ustr = "\\u" + code16;
                }
                ret += ustr;
            }
            return ret;
        }
        function hexToBytes(hex) {
            for (var bytes = [], c = 0; c < hex.length; c += 2) {
                bytes.push(parseInt(hex.substr(c, 2), 16));
            }
            return bytes;
        }
        function byte2striing(bs) {
            return String.fromCharCode.apply(null, new Uint8Array(bs))
        }
        return byte2striing(hexToBytes(string2unicode(str_u).replace(/\u/g, '').replace(/0+/g, ''))).replace(/\s+/g, '').replace(/\t+/g, '').replace(/\n+/g, '').replace(/\r+/g, '');
    },
    downLoadByUrl: function (url, defaultFileName, headerMap) {
        var filename = "未知文件名";
        if (defaultFileName) {
            filename = defaultFileName;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        if (headerMap) {
            for (var key in headerMap) {
                xhr.setRequestHeader(key, headerMap[key]);
            }
        }
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            if (this.status == 200) {
                var contentDisposition = xhr.getResponseHeader(
                    "content-disposition"
                );
                if (contentDisposition) {
                    filename = decodeURIComponent(
                        contentDisposition.split("filename=")[1]
                    );
                }

                var blob = this.response;
                blob.type = "application/octet-stream";
                var url = URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                //释放之前创建的URL对象
                window.URL.revokeObjectURL(url);
            }
        };
        xhr.send();
    }
};