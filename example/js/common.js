"use script"; //开发环境建议开启严格模式

//读取 config.json 配置文件
let configUrl = "config/config.json";

mars2d.axios
  .get(configUrl)
  .then(function (response) {
    //构建地图
    window.initMap(response.data.map);
  })
  .catch(function (error) {
    console.log(error);
    haoutil.alert(error && error.message, "出错了");
  });

function openTipView(content, title) {
  window.layer.open({
    type: 1,
    title: title || "功能 和 已知问题 提示",
    offset: "rt",
    shade: false,
    skin: "animation-scale-up",
    content: content,
  });
}

if ($("#tipView").length > 0) {
  openTipView($("#tipView"));
}
