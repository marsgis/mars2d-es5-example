/* eslint-disable */

//第三方类库加载管理js，方便切换lib


var configLibs = {
  //////////////////////////Mars2D地图渲染相关库////////////////////////
  'mars2d': [//地图 主库
    "leaflet/leaflet.css",
    "leaflet/leaflet.js",
    "mars2d/mars2d.css",
    "mars2d/mars2d.js",
  ],
  'mars2d-esri': [
    //arcgis服务支持插件
    "mars2d/plugins/esri/mars2d-esri.js"
  ],
  'mars2d-mapv': [
    //mapv支持插件
    'mapV/mapv.min.js',
    "mars2d/plugins/mapv/mars2d-mapv.js"
  ],
  'mars2d-echarts': [
    //echarts支持插件
    "echarts/echarts.min.js",
    "mars2d/plugins/echarts/mars2d-echarts.js"
  ],
  'mars2d-widget': [
    //传统JS的widget模块化插件
    "mars2d/plugins/widget/mars2d-widget.css",
    "mars2d/plugins/widget/mars2d-widget.js"
  ],
  //////////////////////////leaflet第3方插件////////////////////////
  'leaflet-sideBySide': [
    "mars2d/thirdParty/sideBySide/leaflet-side-by-side.min.js",
  ],

  //////////////////////////其他地图渲染相关库////////////////////////
  'turf': [
    "turf/turf.min.js"
  ],
  'echarts': [
    "echarts/echarts.min.js",
    "echarts/dark.js"
  ],
  'echarts-gl': [
    "echarts/echarts.min.js",
    "echarts/echarts-gl/echarts-gl.min.js"
  ],
  'echarts-liquidfill': [
    "echarts/echarts.min.js",
    "echarts/echarts-liquidfill/echarts-liquidfill.js"
  ],
  'terraformer': [
    "terraformer/terraformer-1.0.9.min.js",
    "terraformer/terraformer-wkt-parser-1.2.0.min.js",
  ],
  'kriging': [
    "kriging/kriging.min.js"
  ],
  'three': [
    "three/three.js"
  ],


  ////////////////////////// UI界面相关库////////////////////////
  'jquery': [
    "jquery/jquery-2.1.4.min.js",
  ],
  'layer': [
    "layer/theme/default/layer.css",
    "layer/theme/retina/retina.css",
    "layer/layer.js"
  ],
  'jquery.scrollTo': [
    "jquery/scrollTo/jquery.scrollTo.min.js",
  ],
  'jquery.minicolors': [
    "jquery/minicolors/jquery.minicolors.css",
    "jquery/minicolors/jquery.minicolors.min.js",
  ],
  'jquery.range': [
    "jquery/range/range.css",
    "jquery/range/range.js",
  ],
  'ztree': [
    "jquery/ztree/css/zTreeStyle/zTreeStyle.css",
    "jquery/ztree/js/jquery.ztree.all.min.js",
  ],
  'jstree': [
    "jstree/themes/default-dark/style.css",
    "jstree/jstree.min.js",
  ],
  'jquery.mCustomScrollbar': [
    "jquery/mCustomScrollbar/jquery.mCustomScrollbar.css",
    "jquery/mCustomScrollbar/jquery.mCustomScrollbar.js",
  ],
  'jedate': [
    "jquery/jedate/skin/jedate.css",
    "jquery/jedate/jedate.js",
  ],
  'lazyload': [
    "jquery/lazyload/jquery.lazyload.min.js",
  ],
  'bootstrap': [
    "bootstrap/bootstrap.css",
    "bootstrap/bootstrap.min.js",
  ],
  'bootstrap-table': [
    "bootstrap/bootstrap-table/bootstrap-table.css",
    "bootstrap/bootstrap-table/bootstrap-table.min.js",
    "bootstrap/bootstrap-table/locale/bootstrap-table-zh-CN.js"
  ],
  'bootstrap-select': [
    "bootstrap/bootstrap-select/bootstrap-select.css",
    "bootstrap/bootstrap-select/bootstrap-select.min.js",
  ],
  'bootstrap-checkbox': [
    "bootstrap/bootstrap-checkbox/awesome-bootstrap-checkbox.css",
  ],
  'bootstrap-slider': [
    "bootstrap/bootstrap-slider/bootstrap-slider.min.css",
    "bootstrap/bootstrap-slider/bootstrap-slider.min.js",
  ],
  'nprogress': [
    "nprogress/nprogress.css",
    "nprogress/nprogress.min.js",
  ],
  'toastr': [
    "toastr/toastr.css",
    "toastr/toastr.js",
  ],
  'formvalidation': [
    "formvalidation/formValidation.css",
    "formvalidation/formValidation.min.js",
    "formvalidation/framework/bootstrap.min.js",
    "formvalidation/language/zh_CN.min.js",
  ],
  'admui': [
    "admui/css/index.css",
    "admui/js/global/core.js", //核心
    "admui/js/global/configs/site-configs.js",
    "admui/js/global/components.js",
  ],
  'admui-frame': [
    "admui/css/site.css",
    "admui/js/app.js",
  ],
  'admin-lte': [
    "fonts/font-awesome/css/font-awesome.min.css",
    "admin-lte/css/AdminLTE.min.css",
    "admin-lte/css/skins/skin-blue.min.css",
    "admin-lte/js/adminlte.min.js"
  ],
  'ace': [
    "ace/ace.js"
  ],
  'highlight': [
    "highlight/styles/foundation.css",
    "highlight/highlight.pack.js"
  ],

  'animate': [
    "animate/animate.css",
  ],
  'font-awesome': [
    "fonts/font-awesome/css/font-awesome.min.css",
  ],
  'web-icons': [
    "fonts/web-icons/web-icons.css",
  ],

  ////////////////////////// 其他库////////////////////////
  'haoutil': [
    "hao/haoutil.js"
  ],
  'localforage': [
    "localforage/localforage.js"
  ],
}


//内部处理方法
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

  function inputLibs (list, baseUrl) {
    if (list == null || list.length === 0) {
      return
    }

    for (var i = 0, len = list.length; i < len; i++) {
      var url = list[i]
      if (!url.startsWith("http") && !url.startsWith("//:")) {
        url = baseUrl + url
      }

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
    var arrInclude = (targetScript.getAttribute('include') || '').split(',')
    var libpath = targetScript.getAttribute('libpath') || ''
    if (libpath.lastIndexOf('/') !== libpath.length - 1) {
      libpath += '/'
    }


    var keys = {}
    for (var i = 0, len = arrInclude.length; i < len; i++) {
      var key = arrInclude[i]

      if (keys[key]) {
        //规避重复引入lib
        continue
      }
      keys[key] = true


      inputLibs(configLibs[key], libpath)
    }
  }

  load()
})()
