// import * as mars2d from "mars2d"

let map // mars2d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = function (option) {
  option = {
    zoom: 7,
    center: [31.085815, 112.115479],

    control: {
      scale: true,
      locationBar: {
        template: "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>层级:{level}</div>"
      },
      zoom: { position: "bottomleft" },
      toolBar: { position: "bottomleft" }
    }
  }
  return option
}

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

  map.setView([37.75, -122.23], 10)

  // 添加底图 [需要引用esri-leaflet插件]
  const layer = new mars2d.layer.ArcGisImageLayer({
    type: "arcgis_image",
    url: "https://landsat.arcgis.com/arcgis/rest/services/Landsat/PS/ImageServer"
  })
  map.addLayer(layer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}
