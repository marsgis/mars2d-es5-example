/* 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//第三方类库加载管理js，方便切换lib
/* eslint-disable */
; (function () {
  var r = new RegExp('(^|(.*?\\/))(include-lib.js)(\\?|$)'),
    s = document.getElementsByTagName('script'),
    targetScript
  for (var i = 0; i < s.length; i++) {
    var src = s[i].getAttribute('src')
    if (src) {
      var m = src.match(r)
      if (m) {
        targetScript = s[i]
        break
      }
    }
  }

  // cssExpr 用于判断资源是否是css
  var cssExpr = new RegExp('\\.css')

  function inputLibs (list) {
    if (list == null || list.length === 0) {
      return
    }

    for (var i = 0, len = list.length; i < len; i++) {
      var url = list[i]
      if (cssExpr.test(url)) {
        var css = '<link rel="stylesheet" href="' + url + '">'
        document.writeln(css)
      } else {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>'
        document.writeln(script)
      }
    }
  }

  //加载类库资源文件
  function load () {
    var arrInclude = (targetScript.getAttribute('include') || "").split(",");
    var libpath = (targetScript.getAttribute('libpath') || "");


    //在线lib，开发中请注释下面代码
    var isOnline = (window.location.hostname.indexOf('mars') != -1);
    if (isOnline) {
      libpath = "//mars2d.cn/lib/"
    }
    //在线lib end，开发中请注释上面代码

    if (libpath.lastIndexOf('/') !== libpath.length - 1) {
      libpath += '/'
    }

    var libsConfig = {
      'jquery': [
        libpath + "jquery/jquery-2.1.4.min.js",
      ],
      'jquery.scrollTo': [
        libpath + "jquery/scrollTo/jquery.scrollTo.min.js",
      ],
      'jquery.minicolors': [
        libpath + "jquery/minicolors/jquery.minicolors.css",
        libpath + "jquery/minicolors/jquery.minicolors.min.js",
      ],
      'jquery.range': [
        libpath + "jquery/range/range.css",
        libpath + "jquery/range/range.js",
      ],
      'ztree': [
        libpath + "jquery/ztree/css/zTreeStyle/zTreeStyle.css",
        libpath + "jquery/ztree/js/jquery.ztree.all.min.js",
      ],
      'jquery.mCustomScrollbar': [
        libpath + "jquery/mCustomScrollbar/jquery.mCustomScrollbar.css",
        libpath + "jquery/mCustomScrollbar/jquery.mCustomScrollbar.js",
      ],
      'jedate': [
        libpath + "jquery/jedate/skin/jedate.css",
        libpath + "jquery/jedate/jedate.js",
      ],
      'lazyload': [
        libpath + "jquery/lazyload/jquery.lazyload.min.js",
      ],
      'font-awesome': [
        libpath + "fonts/font-awesome/css/font-awesome.min.css",
      ],
      'font-marsgis': [
        libpath + "fonts/marsgis/iconfont.css",
      ],
      'web-icons': [
        libpath + "fonts/web-icons/web-icons.css",
      ],
      'animate': [
        libpath + "animate/animate.css",
      ],
      'admui': [
        libpath + "admui/css/index.css",
        libpath + "admui/js/global/core.js", //核心
        libpath + "admui/js/global/configs/site-configs.js",
        libpath + "admui/js/global/components.js",
      ],
      'admui-frame': [
        libpath + "admui/css/site.css",
        libpath + "admui/js/app.js",
      ],
      'bootstrap': [
        libpath + "bootstrap/bootstrap.css",
        libpath + "bootstrap/bootstrap.min.js",
      ],
      'bootstrap-table': [
        libpath + "bootstrap/bootstrap-table/bootstrap-table.css",
        libpath + "bootstrap/bootstrap-table/bootstrap-table.min.js",
        libpath + "bootstrap/bootstrap-table/locale/bootstrap-table-zh-CN.js"
      ],
      'bootstrap-select': [
        libpath + "bootstrap/bootstrap-select/bootstrap-select.css",
        libpath + "bootstrap/bootstrap-select/bootstrap-select.min.js",
      ],
      'bootstrap-checkbox': [
        libpath + "bootstrap/bootstrap-checkbox/awesome-bootstrap-checkbox.css",
      ],
      'bootstrap-slider': [
        libpath + "bootstrap/bootstrap-slider/bootstrap-slider.min.css",
        libpath + "bootstrap/bootstrap-slider/bootstrap-slider.min.js",
      ],
      'nprogress': [
        libpath + "nprogress/nprogress.css",
        libpath + "nprogress/nprogress.min.js",
      ],
      'toastr': [
        libpath + "toastr/toastr.css",
        libpath + "toastr/toastr.js",
      ],

      'admin-lte': [
        libpath + "fonts/font-awesome/css/font-awesome.min.css",
        libpath + "admin-lte/css/AdminLTE.min.css",
        libpath + "admin-lte/css/skins/skin-blue.min.css",
        libpath + "admin-lte/js/adminlte.min.js"
      ],
      'ace': [
        libpath + "ace/ace.js"
      ],
      'layer': [
        libpath + "layer/theme/default/layer.css",
        libpath + "layer/theme/retina/retina.css",
        libpath + "layer/layer.js",
      ],
      'haoutil': [
        libpath + "hao/haoutil.js",
      ],
      'localforage': [
        libpath + "localforage/localforage.js"
      ],
      'echarts': [
        libpath + "echarts/echarts.min.js",
        libpath + "echarts/dark.js"
      ],
      'echarts-gl': [
        libpath + "echarts/echarts.min.js",
        libpath + "echarts/echarts-gl/echarts-gl.min.js"
      ],
      'echarts-liquidfill': [
        libpath + "echarts/echarts.min.js",
        libpath + "echarts/echarts-liquidfill/echarts-liquidfill.js"
      ],
      'highlight': [
        libpath + "highlight/styles/foundation.css",
        libpath + "highlight/highlight.pack.js"
      ],
      'turf': [
        libpath + "turf/turf.min.js"
      ],
      'terraformer': [
        libpath + "terraformer/terraformer-1.0.9.min.js",
        libpath + "terraformer/terraformer-wkt-parser-1.2.0.min.js",
      ],
      'kriging': [
        libpath + "kriging/kriging.min.js"
      ],

      'mars2d-esri': [ //arcgis服务支持插件
        libpath + "mars2d/plugins/esri/mars2d-esri.js"
      ],
      'mars2d-widget': [
        libpath + "mars2d/plugins/widget/mars2d-widget.css",
        libpath + "mars2d/plugins/widget/mars2d-widget.js"
      ],
      'mars2d-mapv': [
        //mapv支持插件
        libpath + 'mapV/mapv.min.js',
        libpath + "mars2d/plugins/mapv/mars2d-mapv.js"
      ],
      'mars2d-echarts': [
        //echarts支持插件
        libpath + "echarts/echarts.min.js",
        libpath + "mars2d/plugins/echarts/mars2d-echarts.js"
      ],

      'mars2d': [//地图 主库
        libpath + "leaflet/leaflet.css",
        libpath + "leaflet/leaflet.js",
        libpath + "mars2d/mars2d.css",
        libpath + "mars2d/mars2d.js",
      ],
    };




    var keys = {};
    for (var i = 0, len = arrInclude.length; i < len; i++) {
      var key = arrInclude[i];

      if (keys[key]) continue; //规避重复引入lib
      keys[key] = true;

      inputLibs(libsConfig[key]);

    }

  }

  load();
})();
