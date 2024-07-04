// import * as mars2d from "mars2d"

var map // mars3d.Map三维地图对象

function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 调整亮度 （演示滑动条）
function updateBrightness(val) {
  console.log(val)
}

// 是否运行地图鼠标交互
function enableMapMouseController(value) {
  map.setOptions({ dragging: false })
}
