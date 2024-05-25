
// UMD魔法代码
// if the module has no dependencies, the above pattern can be simplified to

// 定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0
var PI = 3.1415926535897932384626
var a = 6378245.0
var ee = 0.00669342162296594323
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
 function bd09togcj02(bd_lon, bd_lat) {
  var bd_lons = +bd_lon
  var bd_lats = +bd_lat
  var x = bd_lons - 0.0065
  var y = bd_lats - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
  var gg_lng = z * Math.cos(theta)
  var gg_lat = z * Math.sin(theta)
  return [gg_lng, gg_lat]
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
 function gcj02tobd09(lng, lat) {
  var lats = +lat
  var lngs = +lng
  var z = Math.sqrt(lngs * lngs + lats * lats) + 0.00002 * Math.sin(lats * x_PI)
  var theta = Math.atan2(lats, lngs) + 0.000003 * Math.cos(lngs * x_PI)
  var bd_lng = z * Math.cos(theta) + 0.0065
  var bd_lat = z * Math.sin(theta) + 0.006
  return [bd_lng, bd_lat]
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
 function wgs84togcj02(lng, lat) {
  var lats = +lat
  var lngs = +lng
  if (out_of_china(lngs, lats)) {
    return [lngs, lats]
  } else {
    var dlat = transformlat(lngs - 105.0, lats - 35.0)
    var dlng = transformlng(lngs - 105.0, lats - 35.0)
    var radlat = lats / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    var mglat = lats + dlat
    var mglng = lngs + dlng
    return [mglng, mglat]
  }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
 function gcj02towgs84(lng, lat) {
  var lats = +lat
  var lngs = +lng
  if (out_of_china(lngs, lats)) {
    return [lngs, lats]
  } else {
    var dlat = transformlat(lngs - 105.0, lats - 35.0)
    var dlng = transformlng(lngs - 105.0, lats - 35.0)
    var radlat = lats / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    var mglat = lats + dlat
    var mglng = lngs + dlng
    return [lngs * 2 - mglng, lats * 2 - mglat]
  }
}

 function transformlat(lng, lat) {
  var lats = +lat
  var lngs = +lng
  var ret = -100.0 + 2.0 * lngs + 3.0 * lats + 0.2 * lats * lats + 0.1 * lngs * lats + 0.2 * Math.sqrt(Math.abs(lngs))
  ret += (20.0 * Math.sin(6.0 * lngs * PI) + 20.0 * Math.sin(2.0 * lngs * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lats * PI) + 40.0 * Math.sin(lats / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lats / 12.0 * PI) + 320 * Math.sin(lats * PI / 30.0)) * 2.0 / 3.0
  return ret
}

 function transformlng(lng, lat) {
  var lats = +lat
  var lngs = +lng
  var ret = 300.0 + lngs + 2.0 * lats + 0.1 * lngs * lngs + 0.1 * lngs * lats + 0.1 * Math.sqrt(Math.abs(lngs))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lngs * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lngs * PI) + 40.0 * Math.sin(lngs / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lngs / 12.0 * PI) + 300.0 * Math.sin(lngs / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
 function out_of_china(lng, lat) {
  var lats = +lat
  var lngs = +lng
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lngs > 73.66 && lngs < 135.05 && lats > 3.86 && lats < 53.55)
}

