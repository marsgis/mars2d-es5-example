"use script" //开发环境建议开启严格模式
;(function (window, mars2d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars2d.widget.BaseWidget {
    //弹窗配置
    get view() {
      return {
        type: "window",
        url: "view.html",
        style: "dark",
        windowOptions: {
          skin: "animation-scale-up",
          width: 250,
          position: {
            top: 10,
            left: 5,
            bottom: 30
          }
        }
      }
    }

    //初始化[仅执行1次]
    create() {
      let that = this
      mars2d.Util.fetchJson({
        url: this.path + "config/attr.json"
      })
        .then((data) => {
          that.attrConfig = data
          that.setDefaultVal()

          // that.attrConfig["curve"] = that.attrConfig["polyline"];
          that.startEditing()
        })
        .catch((error) => {
          console.log("请求出错了", error)
        })
    }
    //获取所有可配置属性的默认值
    setDefaultVal() {
      let data = this.attrConfig

      //标号默认样式
      let attrDefConfig = {}
      for (let i in data) {
        let defstyle = {}
        for (let idx = 0; idx < data[i].style.length; idx++) {
          let item = data[i].style[idx]
          defstyle[item.name] = item.defval
        }
        attrDefConfig[i] = defstyle
      }
      this.attrDefConfig = attrDefConfig

      // let logInfo = JSON.stringify(attrDefConfig);
      // console.log("标号默认样式", logInfo);
    }

    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      this.viewWindow = result
    }
    //激活插件
    activate() {}
    //释放插件
    disable() {}
    getDefStyle(type) {
      let defStyle = this.attrDefConfig[type] || {}
      return mars2d.Util.clone(defStyle)
    }
    getMinPointNum() {
      let graphic = this.config.graphic
      if (graphic && graphic._minPointNum) {
        return graphic._minPointNum
      }
      return 3
    }
    getMaxPointNum() {
      let graphic = this.config.graphic
      if (graphic && graphic._maxPointNum) {
        return graphic._maxPointNum
      }
      return 999
    }
    get defaultAttrList() {
      return [
        { name: "id", label: "主键", type: "label", defval: "" },
        { name: "name", label: "名称", type: "text", defval: "" },
        { name: "remark", label: "备注", type: "textarea", defval: "" }
      ]
    }
    getAttrList() {
      return this.config.attrList || this.defaultAttrList
    }
    startEditing(graphic, lonlats) {
      if (graphic) {
        this.config.graphic = graphic
      }
      if (lonlats) {
        this.config.lonlats = lonlats
      }

      if (this.viewWindow == null) {
        return
      }

      graphic = this.config.graphic
      lonlats = this.config.lonlats
      this.viewWindow.plotEdit.startEditing(graphic.marsOptions, lonlats)
    }
    //更新图上的属性
    updateAttr2map(attr) {
      console.log("更新属性", attr)

      let graphic = this.config.graphic //当前编辑的graphic
      if (attr.style) {
        graphic.style = attr.style
      }
      if (attr.attr) {
        graphic.attr = attr.attr
      }
    }
    //更新坐标
    updatePoints2map(points) {
      console.log("更新坐标", points)

      let graphic = this.config.graphic
      graphic.latlngs = mars2d.PointTrans.coords2latlngs(points)
    }
    centerCurrentEntity() {
      let graphic = this.config.graphic
      this.map.flyToGraphic(graphic)
    }
    deleteEntity() {
      let graphic = this.config.graphic
      graphic.remove()

      this.disableBase()
    }

    //文件处理
    getGeoJson() {
      let graphic = this.config.graphic
      let geojson = graphic.toGeoJSON()
      geojson.properties._layer = graphic._layer.name //记录分组信息

      return geojson
    }
  }

  //注册到widget管理器中。
  mars2d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars2d)
