let exConfig

let containExamples = false,
  thumbLocation = getThumbLocation()

$(document).ready(function () {
  bindEvents()

  //懒加载
  setTimeout(function () {
    $("img.chart-thumb").lazyload()
  }, 1000)

  $.ajax({
    type: "get",
    dataType: "json",
    url: "config/example.json", //配置文件目录
    success: function (result) {
      exConfig = exampleData(result)

      haoutil.storage.add("example-config", JSON.stringify(exConfig))

      initPage()
    },
    error: function (error) {
      console.log("加载JSON出错", error)
      haoutil.alert(error?.message, "出错了")
    }
  })
})

//处理示例配置数据
function exampleData(arr) {
  arr.forEach((item1, index1) => {
    let count = 0
    item1.id = "ex_" + index1
    if (item1.children) {
      item1.children.forEach((item2, index2) => {
        item2.count = item2.children ? item2.children.length : 0 //统计个数
        count += item2.count

        item2.id = item1.id + "_" + index2
        if (item2.children) {
          item2.children.forEach((item3, index3) => {
            if (item3.hidden) {
              count--
              item2.count--
            }
            item3.id = item3.id + "_" + index3
            item3.fullName = `${item1.name}  -  ${item2.name}  -  ${item3.name}`
          })
        }
      })
    }
    item1.count = count //统计个数
  })

  // haoutil.file.downloadFile("example.json", JSON.stringify(arr))

  return arr
}

//侧边栏滚动支持
function sidebarScrollFix() {
  $("ul#sidebar-menu>li").hover(
    function (evt) {
      if (!$("body").hasClass("sidebar-collapse")) {
        return
      }

      //调整一级菜单li下标题的布局位置至右侧
      let $titleBar = $(this).children("a").children(".sidebar-title-bar")
      $titleBar.css({
        top: $(this).offset().top - $(window).scrollTop() + "px",
        //fix由于侧边栏滚动条宽度引起的减少的宽度
        width: "233px"
      })

      //如果底部空间不够，动态增加侧边栏高度
      let visibleOffsetTop = $(this).offset().top - $(window).scrollTop()
      let offsetBottom = $(".sidebar-menu").height() - visibleOffsetTop
      let requireVisibleHeight = $(this).height() + $(this).children("ul").height()
      if (offsetBottom <= requireVisibleHeight) {
        $(".sidebar-menu").css({
          height: requireVisibleHeight + $(window).height() + "px"
        })
      }

      //调整一级菜单li下子列表的布局位置至右侧
      let offsetTop = visibleOffsetTop + $(this).height()
      $(this)
        .children("ul")
        .css({
          top: offsetTop + "px"
        })

      //fix小尺寸屏幕下二级菜单高度高于窗口高度时显示不全的情况
      let $activeList = $(this).children("ul")
      let activeListOffsetBottom = Math.abs($(window).height() - visibleOffsetTop - $(this).height())
      let requireActiveListHeight = $activeList.height()
      if (activeListOffsetBottom < requireActiveListHeight) {
        $activeList.css({ height: requireActiveListHeight })
        //滚动条样式
        $activeList.addClass("scroll-list")
      }
    },
    function (evt) {
      if (!$("body").hasClass("sidebar-collapse")) {
        return
      }
      //滚动条
      $(this).children("ul").removeClass("scroll-list")
      //恢复原来的高度
      $(this).children("ul").css({ height: "auto" })
    }
  )
  $(".main-sidebar").on("scroll", function (evt) {
    evt.stopPropagation()
  })

  $(window).on("resize", function () {
    $(".sidebar-menu").css({ height: "100%" })
  })
}

//创建菜单项
function createSideBarMenuItem(config, containAll) {
  if (!config) {
    return
  }
  containExamples = containAll
  let li = $("<li id='bar_" + config.id + "' onclick=selectMenu('" + config.id + "') class='treeview '></li>")

  if (config.children) {
    createSideBarMenuTitle(config, true).appendTo(li)
    createSideBarSecondMenu(config.children).appendTo(li)
  } else {
    createSideBarMenuTitle(config, false).appendTo(li)
  }

  return li
}

//创建二级菜单
function createSideBarSecondMenu(children) {
  let ul = $("<ul class='treeview-menu second-menu '></ul>")
  children.forEach((item, index) => {
    let li = $("<li class='menuTitle ' id='bar_" + item.id + "' ></li>")
    li.appendTo(ul)

    if (containExamples && item.children) {
      createSideBarMenuSecondTitle(item, true).appendTo(li)
      createSideBarThirdMenu(item.children).appendTo(li)
    } else {
      createSideBarMenuSecondTitle(item, false).appendTo(li)
    }
  })
  return ul
}

function fileName2Id(file) {
  let value = (file || "").replace(".html", "")
  return value
}
function id2FileName(id) {
  return id + ".html"
}

//创建三级菜单
function createSideBarThirdMenu(examples) {
  let ul = $("<ul class='treeview-menu third-menu'></ul>")
  let len = examples && examples.length ? examples.length : 0
  for (let i = 0; i < len; i++) {
    let example = examples[i]
    let _id = fileName2Id(example.main)
    let li = $("<li class='menuTitle' id='bar_" + _id + "' ></li>")
    li.appendTo(ul)
    if (_id != "" && example.name) {
      createSideBarMenuThirdTitle(_id, example, false).appendTo(li)
    }
  }
  return ul
}

function createSideBarMenuTitle(config, collapse) {
  let id = config.id || ""
  let icon = "",
    iconName = config.icon
  if (iconName) {
    icon = "<i class='fa " + iconName + " iconName'></i>"
  }

  let href = ""
  if (location.href.indexOf("editor-es5.html") != -1) {
    href = "../index.html#" + id
  } else {
    href = "#" + id
  }

  let div = $("<a  href='" + href + "' >" + icon + "<span class='firstMenuTitle'>" + config.name + "(" + config.count + ")</span></a>")
  if (collapse) {
    div.append(createCollapsedIcon())
  }
  return div
}

function createSideBarMenuSecondTitle(item, collapse) {
  let id = item.id || ""
  let icon = "",
    iconName = item.icon
  if (iconName) {
    icon = "<i class='fa " + iconName + "'></i>"
  }

  let href = ""
  if (location.href.indexOf("editor-es5.html") != -1) {
    href = "../index.html#" + id
  } else {
    href = "#" + id
  }

  let div = $(
    "<a href='" + href + "' id='bar_" + item.id + "'>" + icon + "<span class='secondMenuTitle'>" + item.name + "(" + item.count + ")</span></a>"
  )

  if (collapse) {
    div.append(createCollapsedIcon())
  }
  return div
}

function createSideBarMenuThirdTitle(id, item, collapse) {
  id = id || ""
  let icon = "",
    iconName = item.icon
  if (iconName) {
    icon = "<i class='fa " + iconName + "'></i>"
  }

  let div = $("<a href='#' id='bar_" + id + "'>" + icon + "<span class='thirdMenuTitle'>" + item.name + "</span></a>")
  if (collapse) {
    div.append(createCollapsedIcon())
  }
  return div
}

//创建右侧折叠菜单
function createCollapsedIcon() {
  return $("<span class='pull-right-container'> <i class='fa fa-angle-left pull-right'></i> </span>")
}

//只处理三层节点,后续可优化
function selectMenu(id, length) {
  let target = _getTarget(id, length)
  if (length !== 1) {
    //控制editor页面左侧导航栏一级菜单高亮
    _selectTarget(target.parent().parent().parent().parent())
    //控制示例页面左侧导航栏一级菜单高亮
    _selectTarget(target.parent().parent())
    //控制左侧导航栏最低级菜单高亮
    _selectTarget(target.parent())
    _selectTarget(target.find("ul"))
  }
}

function _getTarget(id, length) {
  let target
  if (length) {
    if (length === 1) {
      $("section#sidebar li.active").removeClass("active")
      target = $("section#sidebar li#bar_" + id)
      target.children("ul").show()
    }
    if (length === 2) {
      $("section#sidebar li.active ul.active li").removeClass("active")
      target = $("section#sidebar li.treeview")
        .children("ul")
        .children("li#bar_" + id)
    }
  } else {
    $("section#sidebar #ul").addClass("active")
    $("section#sidebar li.active").removeClass("active")
    target = $("section#sidebar li#bar_" + id)
  }
  target && target.addClass("active")
  return target
}

function _selectTarget(target) {
  if (!target || target.length < 1) {
    return
  }
  let className = target.attr("class")
  if (className && className.indexOf("treeview-menu") > -1 && className.indexOf("menu-open") === -1) {
    target.addClass("menu-open")
    target.css("display", "block")
  }
  if (className && className.indexOf("treeview") > -1) {
    target.addClass("active")
  }
}

//左侧层级不包含例子，只包含分类
function initPage() {
  let sideBar = $("ul#sidebar-menu")
  let chartList = $("#charts-list")

  exConfig.forEach((item, index1) => {
    let count = 0
    if (item.children) {
      item.children.forEach((configItem, index) => {
        configItem.count = configItem.children ? configItem.children.length : 0
        count += configItem.count
      })
    }
    item.count = count

    sideBar.append(createSideBarMenuItem(item, containExamples))
    chartList.append(createGalleryItem(item))
  })
  resizeCharts()
  initSelect()
  sidebarScrollFix()
}

//初始化页面第一次加载
function initSelect() {
  let hash = window.location.hash
  if (hash.indexOf("#") === -1) {
    // var id = $('#sidebar li').first().children('a')[0].hash;
    // window.location.hash = (id) ? id : window.location.hash;
  } else {
    scroll()
  }
}

//初始化示例面板
function createGalleryItem(item) {
  if (!item) {
    return
  }

  let categoryLi = $("<li class='category' id='" + item.id + "'></li>")
  if (item.name) {
    createGalleryItemTitle(item).appendTo(categoryLi)
  }
  if (item.children) {
    createSubGalleryItem(item.children).appendTo(categoryLi)
  }
  return categoryLi
}

function createSubGalleryItem(config) {
  let categoryContentDiv = $("<div class='category-content'></div>")
  config.forEach((configItem, index) => {
    let content = $("<div class='box box-default color-palette-box' id='" + config.id + "'></div>")
    createSubGalleryItemTitle(configItem).appendTo(content)
    if (configItem.children) {
      createGalleryCharts(configItem.children).appendTo(content)
    }
    content.appendTo(categoryContentDiv)
  })
  return categoryContentDiv
}

function createGalleryItemTitle(item) {
  return $(
    "<h4 class='category-title' id='" +
      item.id +
      "'>" +
      "<i class='fa " +
      item.icon +
      "'></i>" +
      "&nbsp;&nbsp;" +
      item.name +
      " (" +
      item.count +
      ")</h4>"
  )
}

function createSubGalleryItemTitle(configItem) {
  let details
  if (configItem.details) {
    details = `<div class='box-title-details'>说明：${configItem.details}</div>`
  } else {
    details = ""
  }

  return $(
    "<div class='box-header'>" +
      "<h3 class='box-title' id='" +
      configItem.id +
      "'>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;" +
      configItem.name +
      " (" +
      configItem.count +
      ")</h4>" +
      "</h3>" +
      details +
      "" +
      "</div>"
  )
}

function createGalleryCharts(examples) {
  let chartsDiv = $("<div class='box-body'></div>")
  let len = examples && examples.length ? examples.length : 0
  for (let i = 0; i < len; i++) {
    let item = examples[i]
    if (item.hidden || !item.main) {
      continue
    }
    let html = createGalleryChart(item)
    if (html) {
      html.appendTo(chartsDiv)
    }
  }
  return chartsDiv
}

//获取编辑页面URL地址
function getEditorURL(example) {
  let editorUrl = "editor-es5.html?id=" + example.main

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    editorUrl = "read-es5.html?id=" + example.main //本地开发用read
  }

  if (window.autoShowCode) {
    editorUrl += "&code=true&"
  }
  if (example.params) {
    editorUrl += "&" + example.params + "&name=" + example.fullName
  }
  return editorUrl
}

let h5icon = `<div class="icon-html5"><svg
xmlns="http://www.w3.org/2000/svg"
aria-hidden="true"
role="img"
style="vertical-align: -0.125em"
width="1em"
height="1em"
preserveAspectRatio="xMidYMid meet"
viewBox="0 0 32 32"
>
<path fill="#e44f26" d="M5.902 27.201L3.655 2h24.69l-2.25 25.197L15.985 30L5.902 27.201z" />
<path fill="#f1662a" d="m16 27.858l8.17-2.265l1.922-21.532H16v23.797z" />
<path
  fill="#ebebeb"
  d="M16 13.407h-4.09l-.282-3.165H16V7.151H8.25l.074.83l.759 8.517H16v-3.091zm0 8.027l-.014.004l-3.442-.929l-.22-2.465H9.221l.433 4.852l6.332 1.758l.014-.004v-3.216z"
/>
<path
  fill="#fff"
  d="M15.989 13.407v3.091h3.806l-.358 4.009l-3.448.93v3.216l6.337-1.757l.046-.522l.726-8.137l.076-.83h-7.185zm0-6.256v3.091h7.466l.062-.694l.141-1.567l.074-.83h-7.743z"
/>
</svg></div>`

function createGalleryChart(example) {
  let editorUrl = getEditorURL(example)

  let title = example.name
  let msg = title + " - " + (example.main || "")

  let chartDiv = $("<div class='col-xlg-2 col-lg-3 col-md-4 col-sm-6 col-xs-12'></div>")
  let chart = $('<div class="chart"></div>')
  let link = $("<a class='chart-link' target='_blank' href='" + editorUrl + "'></a>")

  let chartTitle = "<h6 class='chart-title'  title='" + msg + "' >" + title + "</h6>"

  let thumbnail = "config/thumbnail/" + (example.thumbnail || example.main + ".jpg")
  let thumb = $("<img class='chart-area' src='" + thumbnail + "' style='display: inline'>")

  let plugins = getPluginNameByLibs(example.libs)
  if (plugins) {
    msg += "\n该功能属于独立" + plugins + "插件功能，在额外的js中。"
    chartTitle =
      "<h5 class='chart-title' title='" + msg + "'  >" + title + "<span style='color:rgba(0, 147, 255, 0.7)'>[" + plugins + "插件]</span></h5>"
  }
  if (example.hasPannel) {
    chartTitle += h5icon
  }

  chartDiv.attr("title", msg)

  $(chartTitle).appendTo(link)
  thumb.appendTo(link)
  link.appendTo(chart)
  chart.appendTo(chartDiv)

  return chartDiv
}

function getPluginNameByLibs(libs) {
  if (!libs) {
    return false
  }
  for (let index = 0; index < libs.length; index++) {
    const element = libs[index]
    if (element.startsWith("mars2d-")) {
      return element
    }
  }
  return false
}

function imgerrorfun() {
  let img = event.srcElement
  img.src = "img/mapicon.jpg"
  img.onerror = null
}
function openExampleView(href, title) {
  let width = document.documentElement.clientWidth - 230 + "px"
  let height = document.documentElement.clientHeight - 60 + "px"

  let _layerIdx = layer.open({
    type: 2,
    title: title,
    fix: true,
    maxmin: true,
    shadeClose: true,
    offset: ["60px", "230px"],
    area: [width, height],
    content: href,
    skin: "layer-mars-dialog animation-scale-up",
    success: function (layero) {}
  })

  //$("#layui-layer" + _layerIdx).css({
  //    "width": "calc(100% - 230px)",
  //    "height": "calc(100% - 80px)",
  //});
  $("#layui-layer" + _layerIdx + " .layui-layer-title").css({
    background: "rgba(30, 36, 50, 1)",
    "border-color": "rgba(32, 160, 255, 1)"
  })
}

function getThumbLocation() {
  let param = window.location.toString()
  return param.substr(0, param.lastIndexOf("/"))
}

//chart宽高自适应
function resizeCharts() {
  let charts = $("#charts-list .chart .chart-area")
  if (charts[0] && charts[0].offsetWidth) {
    charts.height(charts[0].offsetWidth * 0.8)
  } else {
    charts.height(260 * 0.8)
  }
  window.onresize = function () {
    resizeCharts()
  }
}

//根据url滚动到页面相应的位置
function scroll() {}

//绑定点击事件
function bindEvents() {
  let child = $("ul#sidebar-menu>li.treeview>ul>li")
  // var parent = $('ul.sidebar-menu>li').parent('ul')
  // //因为iManager只有1级所以，iManager点击的时候相当于一级菜单，其他的二级都要关闭.
  // if ($('ul.sidebar-menu>li#firstMenuiManager').find('ul').length == 0) {
  //   if (
  //     $('ul.sidebar-menu>li#firstMenuiManager').click(function () {
  //       $('ul#sidebar-menu>li>ul').slideUp(500)
  //     })
  //   ) {
  //     //
  //   }
  // }
  //一级菜单跳转
  child
    .parent("ul")
    .siblings("a")
    .click(function (evt) {
      if ($(this).siblings("ul").is(":visible") && $(this).siblings("ul").children("li").hasClass("active")) {
        evt.stopPropagation() //阻止点击事件触发折叠的冒泡
      }
      window.location = evt.currentTarget.href
    })

  //二级菜单跳转,不用 boot自带
  window.addEventListener("hashchange", function () {
    scroll()
  })
}

let openTimer // 定义展开的延时
let animationSpeed = 500
$(window).on("scroll", function () {
  if ($("ul.sidebar-menu>li").hasClass("active")) {
    let parent = $("ul.sidebar-menu>li").parent("ul")

    //设置0.1秒后再打开，目的是为了防止滚轮拉快 中途经过的展开和折叠效果还来不及完成而产生的重叠效果;
    if (openTimer) {
      clearTimeout(openTimer)
    }
    openTimer = setTimeout(function () {
      parent
        .children("li.active")
        .children("ul")
        .slideDown(animationSpeed, function () {
          parent.children("li.active").children("ul").css("display", "block")
        })
    }, 100)
  }
  $("ul.sidebar-menu>li").not("li.active").children("ul").css("display", "none")
})
