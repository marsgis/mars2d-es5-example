// import * as mars2d from "mars2d"

let map

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  control: {
    // 面板
    scale: true,
    locationBar: {
      template: "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>层级:{level}</div>"
    },
    // 按钮
    zoom: { position: "bottomleft" },
    toolBar: { position: "bottomleft", item: ["home", "location", "fullscreen"] }
  }
}
function onMounted(mapInstance) {
  map = mapInstance
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 按钮

// 视角复位
function bindView(val) {
  map.controls.toolBar.btnGoHome.style.display = val ? "block" : "none"
}
// 定位
function bindBtnLocation(val) {
  map.controls.toolBar.btnLocation.style.display = val ? "block" : "none"
}
// 全屏
function bindFullScreen(val) {
  map.controls.toolBar.btnFullscreen.style.display = val ? "block" : "none"
}

// 显示缩小
function bindZoomIn(val) {
  map.controls.zoom._zoomInButton.style.display = val ? "block" : "none"
}

// 显示放大
function bindZoomOut(val) {
  map.controls.zoom._zoomOutButton.style.display = val ? "block" : "none"
}

// 面板：

// 显示鼠标提示信息
function bindLocationBar(val) {
  map.controls.locationBar._container.style.display = val ? "block" : "none"
}
// 比例尺
function bindLegend(val) {
  map.controls.scale._container.style.display = val ? "block" : "none"
}
// 底图切换
function bindBaseLayerPicker(val) {
  map.controls.basemapsTool.container.style.display = val ? "block" : "none"
}

// 图层控制
function bindBindLayersTool(val) {
  map.controls.layersTool.container.style.display = val ? "block" : "none"
}
