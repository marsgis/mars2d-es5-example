// import * as mars2d from "mars2d"

let map

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars2d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.container.style.backgroundImage = "url(./img/photo/logo.png)"
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */

function onUnmounted() {
  map = null
}

function opacityChange(opacity) {
  map.basemap.opacity = opacity / 100
}
