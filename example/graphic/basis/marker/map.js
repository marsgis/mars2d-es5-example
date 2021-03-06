// import * as mars2d from "mars2d"

let map // mars2d.Map三维地图对象

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

  // 绑定标绘相关事件监听(可以自行加相关代码实现业务需求，此处主要做示例)
  graphicLayer.on(mars2d.EventType.drawStart, function (e) {
    console.log("开始绘制", e)
  })
  graphicLayer.on(mars2d.EventType.drawAddPoint, function (e) {
    console.log("绘制过程中增加了点", e)
  })
  graphicLayer.on(mars2d.EventType.drawRemovePoint, function (e) {
    console.log("绘制过程中删除了点", e)
  })

  graphicLayer.on(mars2d.EventType.drawCreated, function (e) {
    console.log("创建完成", e)
  })

  graphicLayer.on(mars2d.EventType.editStart, function (e) {
    console.log("开始编辑", e)
    eventTarget.fire("graphicEditor-start", e)
    // startEditing(e.graphic)
  })

  graphicLayer.on(mars2d.EventType.editMovePoint, function (e) {
    console.log("编辑修改了点", e)
    // startEditing(e.graphic)
    eventTarget.fire("graphicEditor-start", e)
  })
  graphicLayer.on(mars2d.EventType.editRemovePoint, function (e) {
    console.log("编辑删除了点", e)

    // startEditing(e.graphic)
    eventTarget.fire("graphicEditor-start", e)
  })

  // 加一些演示数据
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const graphic = new mars2d.graphic.Marker({
    latlng: [31.854628, 117.245425],
    style: {
      image: "img/marker/mark1.png",
      width: 32,
      height: 44,
      horizontalOrigin: mars2d.HorizontalOrigin.CENTER,
      verticalOrigin: mars2d.VerticalOrigin.BOTTOM
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  initLayerManager()

  // graphic.testPoint = true; //打开测试点，与点进行对比调整参数

  // 演示个性化处理graphic，
  initGraphicManager(graphic)
}

function addDemoGraphic2() {
  const graphic = new mars2d.graphic.Marker({
    latlng: L.latLng(31.810858, 117.21),
    style: {
      image: "img/marker/fx1.png",
      width: 30,
      horizontalOrigin: mars2d.HorizontalOrigin.CENTER,
      verticalOrigin: mars2d.VerticalOrigin.CENTER
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  // graphic.bindTooltip("我是maker", { className: "demo-tooltip", direction: "top" });
}

function addDemoGraphic3() {
  const graphic = new mars2d.graphic.Marker({
    latlng: L.latLng(31.818606, 117.296904),
    style: {
      image: "img/marker/emergency.gif",
      width: 40,
      horizontalOrigin: mars2d.HorizontalOrigin.CENTER,
      verticalOrigin: mars2d.VerticalOrigin.CENTER
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)

  // graphic.bindPopup("我是maker", { className: "demo-popup" });
}

function onClickStartDraw() {
  graphicLayer.startDraw({
    type: "marker",
    style: {
      image: "img/marker/mark1.png",
      width: 32,
      height: 44
    },
    success: function (graphic) {
      console.log("标绘完成", graphic)
    }
  })
}
function drawDivMarker() {
  graphicLayer.startDraw({
    type: "divGraphic",
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-red">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">火星水厂</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">实时流量：</div>
                              <div class="data-value"><span id="lablLiuliang" class="label-num">39</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水池液位：</div>
                              <div class="data-value"><span id="lablYeWei"  class="label-num">10.22</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水泵状态：</div>
                              <div class="data-value">
                                <span id="lablSBZT1"  class="label-tag data-value-status-1" alt="中间状态">1号</span>
                                <span id="lablSBZT2"  class="label-tag data-value-status-0" alt="关闭状态">2号</span>
                               </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">出水阀门：</div>
                              <div class="data-value">
                                <span id="lablCSFM1"   class="label-tag data-value-status-1" alt="中间状态">1号</span>
                                <span id="lablCSFM2"   class="label-tag data-value-status-2" alt="打开状态">2号</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      horizontalOrigin: mars2d.HorizontalOrigin.LEFT,
      verticalOrigin: mars2d.VerticalOrigin.BOTTOM
    }
  })
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

    return mars2d.Util.getTemplateHtml({ title: "layer上绑定的Popup", template: "all", attr: attr })
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
        if (graphic && graphic.editing) {
          graphic.editing.enable()
        }
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
        if (graphic && graphic.editing) {
          graphic.editing.disable()
        }
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
