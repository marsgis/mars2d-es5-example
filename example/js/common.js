"use script"; //开发环境建议开启严格模式

//读取 config.json 配置文件
let configUrl = "../config/config.json";

mars2d.Util.fetchJson({ url: configUrl })
  .then(function (data) {
    //构建地图
    window.initMap(data.mars2d);
    if (mars2d.widget && window.map) {
      initWidget(window.map);
    }
  })
  .catch(function (error) {
    console.log(error);
    haoutil.alert(error && error.message, "出错了");
  });

function openTipView(content, title) {
  window.layer.open({
    type: 1,
    title: title || "功能 和 已知问题 提示",
    offset: "rb",
    shade: false,
    skin: "animation-scale-up",
    content: content,
  });
}

if ($("#tipView").length > 0) {
  openTipView($("#tipView"));
}

//初始化widget相关
function initWidget(map) {
  //初始化widget管理器
  mars2d.widget.init(map, {
    defaultOptions: {
      windowOptions: { position: { bottom: 50, left: 10 } },
    },
    openAtStart: [
      {
        name: "右上角工具栏",
        uri: "widgets/toolButton/menuBtn.js",
      },
    ],
    widgets: [
      {
        name: "图层管理",
        uri: "widgets/manageLayers/widget.js",
        group: "forlayer",
        autoCenter: true,
        windowOptions: {
          position: { top: 10, bottom: 40, left: 50 },
        },
        autoDisable: false,
        disableOther: false,
      },
    ],
  });
}
