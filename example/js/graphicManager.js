//矢量数据示例中的图层通用js

//在图层级处理一些事物
function initLayerManager(graphicLayer) {
  //在layer上绑定监听事件
  graphicLayer.on(mars2d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event);
  });

  //可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerPopup(graphicLayer);

  $("#chkPopup").change(function () {
    let val = $(this).is(":checked");

    if (val) {
      bindLayerPopup(graphicLayer);
    } else {
      graphicLayer.unbindPopup();
    }
  });

  //可在图层上绑定tooltip,对所有加到这个图层的矢量数据都生效
  $("#chkTooltip").change(function () {
    let val = $(this).is(":checked");

    if (val) {
      graphicLayer.bindTooltip("我是layer上绑定的Tooltip");
    } else {
      graphicLayer.unbindTooltip();
    }
  });

  //可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu(graphicLayer);
  $("#chkContextMenu").change(function () {
    let val = $(this).is(":checked");

    if (val) {
      bindLayerContextMenu(graphicLayer);
    } else {
      graphicLayer.unbindContextMenu(true);
    }
  });

  $("#chkHasEdit").change(function () {
    let val = $(this).is(":checked");

    graphicLayer.hasEdit = val; //启用编辑
  });

  $("#chkShow").change(function () {
    let val = $(this).is(":checked");

    graphicLayer.show = val; //显示隐藏
  });

  $("#btnClear").click(function () {
    graphicLayer.clear();
  });

  $("#btnExpFile").click(function () {
    if (graphicLayer.length === 0) {
      window.layer.msg("当前没有标注任何数据，无需保存！");
      return;
    }

    let geojson = graphicLayer.toGeoJSON();
    haoutil.file.downloadFile("我的标注.json", JSON.stringify(geojson));
  });

  $("#btnImpFile").click(function () {
    $("#input_draw_file").click();
  });

  function clearSelectFile() {
    if (!window.addEventListener) {
      document.getElementById("input_draw_file").outerHTML += ""; //IE
    } else {
      document.getElementById("input_draw_file").value = ""; //FF
    }
  }

  $("#input_draw_file").change(function (e) {
    let file = this.files[0];

    let fileName = file.name;
    let fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();

    if (fileType == "json" || fileType == "geojson") {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onloadend = function (e) {
        let json = this.result;
        graphicLayer.loadGeoJSON(json, {
          flyTo: true,
        });
        clearSelectFile();
      };
    } else {
      window.layer.msg("暂不支持 " + fileType + " 文件类型的数据！");
      clearSelectFile();
    }
  });
}

function bindLayerPopup(graphicLayer) {
  graphicLayer.bindPopup(function (event) {
    let attr = event.graphic?.attr || {};
    attr.test1 = "测试属性";
    // attr["视频"] = `<video src='http://data.mars2d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video>`;

    return mars2d.Util.getTemplateHtml({ title: "layer上绑定的Popup", template: "all", attr: attr });
  });
}

function bindLayerContextMenu(graphicLayer) {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      iconCls: "fa fa-edit",
      show: function (e) {
        let graphic = e.graphic;
        if (!graphic || !graphic.editing) {
          return false;
        }
        return !graphic.editing.enabled();
      },
      callback: function (e) {
        let graphic = e.graphic;
        if (graphic && graphic.editing) {
          graphic.editing.enable();
        }
      },
    },
    {
      text: "停止编辑对象",
      iconCls: "fa fa-edit",
      show: function (e) {
        let graphic = e.graphic;
        if (!graphic || !graphic.editing) {
          return false;
        }
        return graphic.editing.enabled();
      },
      callback: function (e) {
        let graphic = e.graphic;
        if (graphic && graphic.editing) {
          graphic.editing.disable();
        }
      },
    },
    {
      text: "删除对象",
      iconCls: "fa fa-trash-o",
      show: (event) => {
        let graphic = event.graphic;
        if (!graphic) {
          return false;
        } else {
          return true;
        }
      },
      callback: function (e) {
        let graphic = e.graphic;
        if (!graphic) {
          return;
        }
        graphicLayer.removeGraphic(graphic);
      },
    },
    {
      text: "计算长度",
      iconCls: "fa fa-medium",
      show: function (e) {
        let graphic = e.graphic;
        if (!graphic) {
          return false;
        }
        return graphic.type === "polyline" || graphic.type === "curve";
      },
      callback: function (e) {
        let graphic = e.graphic;
        let strDis = mars2d.MeasureUtil.formatDistance(graphic.distance);
        haoutil.alert("该对象的长度为:" + strDis);
      },
    },
    {
      text: "计算周长",
      iconCls: "fa fa-medium",
      show: function (e) {
        let graphic = e.graphic;
        if (!graphic) {
          return false;
        }
        return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon";
      },
      callback: function (e) {
        let graphic = e.graphic;
        let strDis = mars2d.MeasureUtil.formatDistance(graphic.distance);
        haoutil.alert("该对象的周长为:" + strDis);
      },
    },
    {
      text: "计算面积",
      iconCls: "fa fa-reorder",
      show: function (e) {
        let graphic = e.graphic;
        if (!graphic) {
          return false;
        }
        return graphic.type === "circle" || graphic.type === "rectangle" || graphic.type === "polygon";
      },
      callback: function (e) {
        let graphic = e.graphic;
        let strArea = mars2d.MeasureUtil.formatArea(graphic.area);
        haoutil.alert("该对象的面积为:" + strArea);
      },
    },
  ]);
}

//也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  //3.在graphic上绑定监听事件
  // graphic.on(mars2d.EventType.click, function(event) {
  //   console.log('监听graphic，单击了矢量对象', event)
  // })

  //绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  //绑定Popup
  var inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`;
  graphic.bindPopup(inthtml).openPopup();

  //绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定]",
      iconCls: "fa fa-trash-o",
      callback: function (e) {
        let graphic = e.graphic;
        if (graphic) {
          graphic.remove();
        }
      },
    },
  ]);
}

//取区域内的随机图标
function randomPoint() {
  var jd = haoutil.math.random(116.1 * 1000, 116.6 * 1000) / 1000;
  var wd = haoutil.math.random(30.8 * 1000, 31.1 * 1000) / 1000;
  var height = haoutil.math.random(1000, 9000);
  return new mars2d.LatLngPoint(jd, wd, height);
}
