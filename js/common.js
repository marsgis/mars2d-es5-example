"use script"

const parentGlobal = window.parent || window

parentGlobal.mars2d = mars2d // widget中使用

function init() {
  // 读取 config.json 配置文件
  mars2d.Util.fetchJson({ url: "/config/config.json" })
    .then(function (json) {
      console.log("读取 config.json 配置文件完成", json) // 打印测试信息

      //创建三维地球场景
      const initMapFun = window.initMap ? window.initMap : globalInitMap
      var map = initMapFun(json.mars2d)

      if (window.onMounted) {
        window.onMounted(map)
      }

      if (window.initUI) {
        window.initUI()
      }

      if (window.es5widget) {
        initWidget(map)
      }
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
      globalAlert(error ? error.message : "加载JSON出错")
    })
}
init()

// 构造地图主方法【必须】
function globalInitMap(options) {
  if (window.mapOptions) {
    if (typeof window.mapOptions === "function") {
      options = window.mapOptions(options) || options
    } else {
      window.mapOptions = options = mars2d.Util.merge(options, window.mapOptions)
    }
  }

  // 创建三维地球场景
  return new mars2d.Map("mars2dContainer", options)
}

//初始化widget相关
function initWidget(map) {
  //初始化widget管理器
  es5widget.init(
    map,
    {
      defaultOptions: {
        style: "dark",
        windowOptions: { skin: "layer-mars-dialog animation-scale-up", position: { bottom: 50, left: 10 } }
      },
      openAtStart: [
        {
          name: "右上角工具栏",
          uri: "widgets/toolButton/menuBtn.js"
        }
      ],
      widgets: [
        {
          name: "图层管理",
          uri: "widgets/manageLayers/widget.js",
          group: "forlayer",
          autoCenter: true,
          windowOptions: {
            position: { top: 10, bottom: 40, left: 50 }
          },
          autoDisable: false,
          disableOther: false
        }
      ]
    },
    "/"
  )
}

// 调用项目的消息提示（自动消失）
function globalMsg(content) {
  if (window.layer) {
    window.layer.msg(content) // 此方法需要引用layer.js
  } else if (window.toastr) {
    window.toastr.info(content) // 此方法需要引用toastr
  } else {
    window.alert(content)
  }
}

// 调用项目的弹窗提示（手动单击确定关闭窗口）
function globalAlert(content, title) {
  if (window.layer) {
    // 此方法需要引用layer.js
    window.layer.alert(content, {
      title: title || "提示",
      skin: "layui-layer-lan layer-mars-dialog",
      closeBtn: 0,
      anim: 0
    })
  } else if (window.toastr) {
    window.toastr.info(content, title) // 此方法需要引用toastr
  } else {
    window.alert(content)
  }
}

// 调用项目的右上角信息提示（可关闭）
function globalNotify(title, content) {
  if (window.toastr) {
    window.toastr.warning(content, title) // 此方法需要引用toastr
  } else if (window.layer) {
    // 此方法需要引用layer.js
    window.layer.alert(content, {
      title: title || "提示",
      skin: "layui-layer-lan layer-mars-dialog",
      closeBtn: 0,
      anim: 0
    })
  } else {
    window.alert(content)
  }
}

function showLoading() {
  haoutil.loading.show()
}

function hideLoading() {
  haoutil.loading.close()
}
