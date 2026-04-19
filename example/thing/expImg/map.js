// import * as mars2d from "mars2d"

let map
let expImg

var eventTarget = new mars2d.BaseClass() // 事件对象，用于抛出事件到vue中

var mapOptions = {
  zoom: 13,
  center: { lng: 117.238884, lat: 31.84417 }
}
// 初始化地图业务，生命周期钩子函数（必须），框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  expImg = new mars2d.thing.ExpImg()
  map.addThing(expImg)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */

function onUnmounted() {
  map = null
}

function showMapImg() {
  expImg.expAll({
    download: false,
    calllback: function (base64) {
      // 回调
      eventTarget.fire("loadOk", { base64 })
    }
  })
}

function downLoad() {
  expImg.expAll()
}

function downLoad2() {
  expImg.expByDraw()
}

function shotPartImg() {
  // API及更多资料参考： https://github.com/likaia/js-screen-shot
  // 当前引入的是 public\lib\dom2img\screenShotPlugin.umd.js,官方版本的一种截图方式是基于html2canvas,这会导致截图中出现box-shadow样式错误，
  // 所以这里将html2canvas换成modern-screenshot，详细资料可以看https://github.com/qq15725/modern-screenshot这个仓库
  // eslint-disable-next-line no-undef
  const plugin = new screenShotPlugin({
    clickCutFullScreen: true,
    wrcWindowMode: true,
    loadCrossImg: true,
    enableWebRtc: false,
    level: 999999999,
    h2cImgLoadErrCallback: (err) => {
      console.log("h2cCrossImgLoadErrFn", err)
    },
    h2cIgnoreElementsCallback: (element) => {
      if (element.id === "hideDom") {
        return true
      }
      return false
    },

    completeCallback: ({ base64, cutInfo }) => {
      eventTarget.fire("showPartImg", { base64 })
    }
  })
}
