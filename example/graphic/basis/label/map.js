// import * as mars2d from "mars2d"

var map // mars2d.Map三维地图对象

var graphicLayer

// 事件对象，用于抛出事件给vue
var eventTarget = new mars2d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars2d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 创建矢量数据图层
  graphicLayer = new mars2d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 图层管理的相关处理，
  initLayerManager()

  // 加一些演示数据
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
  addDemoGraphic4()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 在图层级处理一些事物
function initLayerManager() {
  // 在layer上绑定监听事件
  graphicLayer.on(mars2d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu()

  // 可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerPopup()

  eventTarget.fire("defuatData", {
    enabledShowHide: true,
    enabledPopup: true,
    enabledTooltip: false,
    enabledRightMenu: true
  })
}

// 绑定popup
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event?.attr || {}
    attr["类型"] = event.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars2d.Util.getTemplateHtml({ title: "layer上绑定的Popup", template: "all", attr })
  })
}

// 绑定右键菜单
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      iconCls: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.editing) {
          return false
        }
        return !graphic.editing.enabled()
      },
      callback: function (e) {
        const graphic = e.graphic
        graphicLayer.startEditing(graphic)
      }
    },
    {
      text: "停止编辑对象",
      iconCls: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.editing) {
          return false
        }
        return graphic.editing.enabled()
      },
      callback: function (e) {
        const graphic = e.graphic
        graphicLayer.stopEditing()
      }
    },
    {
      text: "删除对象",
      iconCls: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic) {
          return false
        } else {
          return true
        }
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        graphicLayer.removeGraphic(graphic)
      }
    },
    {
      text: "计算长度",
      iconCls: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.type === "polyline" || graphic.type === "brushLine"
      },
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars2d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      iconCls: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon"
      },
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars2d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      iconCls: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon"
      },
      callback: function (e) {
        const graphic = e.graphic
        const strArea = mars2d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  // graphic.on(mars2d.EventType.click, function(event) {
  //   console.log('监听graphic，单击了矢量对象', event)
  // })

  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
      <tr>
        <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
      </tr>
      <tr>
        <td>提示：</td>
        <td>这只是测试信息，可以任意html</td>
      </tr>
    </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定]",
      iconCls: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

function addDemoGraphic1() {
  const graphic = new mars2d.graphic.Label({
    latlng: [31.854628, 117.245425],
    style: {
      text: "合肥火星科技有限公司",
      color: "#0081c2",
      font_size: 25,
      font_family: "楷体"
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  // 演示个性化处理graphic，
  initGraphicManager(graphic)
}

function addDemoGraphic2() {
  const graphic = new mars2d.graphic.Label({
    latlng: L.latLng(31.810858, 117.21),
    style: {
      text: "安徽合肥欢迎您",
      color: "#0000FF",
      font_size: 25,
      font_family: "楷体"
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3() {
  const graphic = new mars2d.graphic.Label({
    latlng: L.latLng(31.818606, 117.296904),
    style: {
      text: "Mars2D平台",
      color: "#FF0000",
      font_size: 25,
      font_family: "楷体",
      background: true,
      background_color: "rgba(0,0,0,0.2)",
      border: true,
      border_width: 2,
      border_style: "",
      border_color: "rgba(255,0,0,0.2)"
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4() {
  const graphic = new mars2d.graphic.Label({
    latlng: L.latLng(31.791464, 117.244377),
    style: {
      text: "地理信息系统",
      color: "#FF0000",
      font_size: 30,
      font_family: "微软雅黑"
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "label",
    style: {
      text: "Mars2D平台",
      color: "#FF0000",
      font_size: 25,
      font_family: "楷体",
      font_style: "normal",
      font_weight: "normal"
    },
    success: function (graphic) {
      console.log("标绘完成", graphic)
    }
  })
}

// 生成演示数据(测试数据量)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars2d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const latlng = result.points[j]
    const index = j + 1

    const graphic = new mars2d.graphic.Label({
      latlng,
      style: {
        text: "Mars2D平台",
        color: "#FF0000",
        font_size: 25,
        font_family: "楷体",
        background: true,
        background_color: "rgba(0,0,0,0.2)",
        border: true,
        border_width: 2,
        border_style: "",
        border_color: "rgba(255,0,0,0.2)"
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  return count.length
}
