// import * as mars2d from "mars2d"

let map // mars2d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  zoom: 9,
  center: { lng: 117.258728, lat: 31.848053 },
  minZoom: 6
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

  const layerWork = new mars2d.layer.GeoJsonLayer({
    url: "//data.mars2d.cn/file/geojson/areas/340100.json",
    mask: true, // 标识为遮罩层【重点参数】
    symbol: {
      styleOptions: {
        fill: true,
        fillColor: "#C0C0C0",
        fillOpacity: 0.8,
        outline: true,
        outlineColor: "#6495ED",
        outlineWidth: 8,
        outlineOpacity: 0.5
      }
    }
  }).addTo(map)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}
