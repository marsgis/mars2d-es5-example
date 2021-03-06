// import * as mars2d from "mars2d"
// import { PoiQueryButton } from "./PoiQueryButton"

let map // mars2d.Map二维地图对象

var mapOptions = {
  center: { lng: 117.237115, lat: 31.805875 }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars2d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const poiQueryButton = new PoiQueryButton({
    insertIndex: 0 // 插入的位置顺序
  })
  map.addControl(poiQueryButton)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}
