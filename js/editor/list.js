/**
 * 功能示例列表（原生 JS 版）
 * 布局与样式参考 mars2d-vue-example 的示例列表：
 * 左侧分类树贴左整页固定、工具条吸顶、卡片网格、移动端分类抽屉。
 */
let exConfig = []
let viewConfig = []
let currentKeyword = ""

$(document).ready(function () {
  initHeader()
  initToolbar()
  initDrawer()
  initDownloads()
  loadExamples()
  $(window).on("scroll", function () {
    $("#toolbar").toggleClass("is-stuck", window.scrollY > 8)
    $(".site-header").toggleClass("is-scrolled", window.scrollY > 8)
  })
})

// 加载示例配置
function loadExamples() {
  $.ajax({
    type: "get",
    dataType: "json",
    url: "config/example.json",
    success: function (result) {
      exConfig = exampleData(result)
      viewConfig = exConfig

      try {
        haoutil.storage.add("example-config", JSON.stringify(exConfig))
      } catch (e) {
        // 隐私模式或配额不足时忽略，不影响页面展示
      }

      $("#all-count").text(countVisible(exConfig))
      renderSidebar(exConfig)
      renderContent(exConfig)
      scrollToHash()
    },
    error: function (error) {
      $("#charts-list").html('<div class="state-card" role="alert"><p>示例列表加载失败，请检查网络后重试</p></div>')
    }
  })
}

// 处理示例配置数据：补充 id、计数与完整名称
function exampleData(arr) {
  arr.forEach(function (item1, index1) {
    item1.id = "ex_" + index1
    let count = 0
    if (item1.children) {
      item1.children.forEach(function (item2, index2) {
        item2.id = item1.id + "_" + index2
        item2.count = 0
        if (item2.children) {
          item2.children.forEach(function (item3, index3) {
            item3.id = item2.id + "_" + index3
            item3.fullName = item1.name + "  -  " + item2.name + "  -  " + item3.name
            if (!item3.hidden && item3.main) {
              item2.count++
            }
          })
          count += item2.count
        }
      })
    }
    item1.count = count
  })
  return arr
}

function isVisible(item) {
  return !!item.main && !item.hidden
}

function countVisible(list) {
  let total = 0
  ;(list || []).forEach(function (item) {
    ;(item.children || []).forEach(function (group) {
      total += (group.children || []).filter(isVisible).length
    })
  })
  return total
}

/* ---------------- 侧栏 ---------------- */
function renderSidebar(list) {
  const $menu = $("#sidebar-menu").empty()
  list.forEach(function (item) {
    const groups = (item.children || []).filter(function (child) {
      return child.children && child.children.length
    })
    if (!groups.length) {
      return
    }

    const $group = $("<div class='sidebar-group'></div>")
    $("<button type='button' class='side1-item'></button>")
      .attr({ "aria-expanded": "false", "aria-controls": "side-" + item.id })
      .append("<i class='fa " + (item.icon || "fa-folder-o") + "' aria-hidden='true'></i>")
      .append($("<span class='name'></span>").text(item.name))
      .append($("<span class='count'></span>").text(item.count))
      .append("<i class='fa fa-angle-right chevron' aria-hidden='true'></i>")
      .on("click", function () {
        toggleCategory(item)
      })
      .appendTo($group)

    const $children = $("<div class='sidebar-children'></div>").attr("id", "side-" + item.id).hide()
    groups.forEach(function (group) {
      $("<a class='side2-item'></a>")
        .attr("href", "#" + group.id)
        .append("<span class='dot' aria-hidden='true'></span>")
        .append($("<span class='name'></span>").text(group.name))
        .append($("<span class='count'></span>").text(group.count))
        .on("click", function (event) {
          event.preventDefault()
          selectSub(item, group)
        })
        .appendTo($children)
    })

    $group.append($children).appendTo($menu)
  })

  const first = list.find(function (item) {
    return item.children && item.children.length
  })
  if (first) {
    toggleCategory(first, true)
  }
}

function toggleCategory(item, forceOpen) {
  const $button = $("#sidebar-menu .side1-item").filter(function () {
    return $(this).attr("aria-controls") === "side-" + item.id
  })
  const $children = $("#side-" + item.id)
  const isOpen = $button.hasClass("active")

  if (isOpen && !forceOpen) {
    $button.removeClass("active").attr("aria-expanded", "false")
    $button.find(".chevron").removeClass("fa-angle-down").addClass("fa-angle-right")
    $children.stop(true, true).slideUp(160)
    $("#active-category").text("全部")
    return
  }

  $button.addClass("active").attr("aria-expanded", "true")
  $button.find(".chevron").removeClass("fa-angle-right").addClass("fa-angle-down")
  $children.stop(true, true).slideDown(160)
  $("#active-category").text(item.name)
  closeDrawer()
}

function selectSub(item, group) {
  $("#sidebar-menu .side2-item").removeClass("active")
  $("#sidebar-menu .side2-item").filter(function () {
    return $(this).attr("href") === "#" + group.id
  }).addClass("active")
  $("#active-category").text(item.name)
  closeDrawer()
  clearSearch()
  scrollToSection(group.id)
}

/* ---------------- 内容区 ---------------- */
function renderContent(list) {
  const $wrap = $("#charts-list").empty()
  let groupsCount = 0

  ;(list || []).forEach(function (item) {
    const groups = (item.children || []).filter(function (group) {
      return group.children && group.children.some(isVisible)
    })
    if (!groups.length) {
      return
    }
    groupsCount++

    const $section = $("<section class='category'></section>").attr("id", item.id)
    $section.append(
      $("<header class='category-title'></header>")
        .append(
          $("<span class='title-box'></span>")
            .append("<i class='fa " + (item.icon || "fa-folder-o") + "' aria-hidden='true'></i>")
            .append($("<span class='title'></span>").text(item.name + "（" + item.count + "）"))
        )
        .append("<span class='line' aria-hidden='true'></span>")
    )
    $section.append($("<div class='list-item'></div>").append(groups.map(function (group) {
      return createSubGroup(group)
    })))
    $wrap.append($section)
  })

  if (!groupsCount) {
    $wrap.append('<div class="state-card"><p>没有找到匹配的示例</p></div>')
  }
}

function createSubGroup(group) {
  const $sub = $("<div class='sub-group'></div>").attr("id", group.id)
  const $title = $("<h2 class='sub-title'></h2>").text(group.name + "（" + group.count + "）")

  if (group.details) {
    const tipId = "detail-" + group.id
    $title.append(
      $("<span class='help-wrap'></span>")
        .append(
          $("<button type='button' class='help-btn'></button>")
            .attr({ "aria-label": group.name + " 说明", "aria-describedby": tipId })
            .append("<i class='fa fa-question-circle' aria-hidden='true'></i>")
        )
        .append($("<span class='detail-tip' role='tooltip'></span>").attr("id", tipId).text(group.details))
    )
  }

  const $cards = $("<div class='cards'></div>")
  ;(group.children || []).filter(isVisible).forEach(function (card) {
    $cards.append(createCard(card))
  })

  return $sub.append($title).append($cards)
}

function createCard(item) {
  const url = getEditorURL(item)
  const plugins = getPluginNameByLibs(item.libs)
  const title = item.name + " - " + (item.main || "")

  const $card = $("<a class='card' target='_blank' rel='noopener'></a>").attr({
    href: url,
    title: title,
    "aria-label": item.name
  })

  const thumb = "config/thumbnail/" + (item.thumbnail || item.main + ".jpg")
  $card.append(
    $("<div class='pic'></div>").append(
      $("<img alt='' loading='lazy' />")
        .attr("src", thumb)
        .on("error", function () {
          this.onerror = null
          this.src = "config/thumbnail/map-options-basemaps.jpg"
        })
    )
  )

  const $name = $("<p class='card-name'></p>").text(item.name)
  if (item.hasPannel && window.hasPannelIcon) {
    $name.append($("<span class='vue'></span>").html(window.hasPannelIcon))
  }
  if (plugins) {
    $name.append($("<span class='plugin'></span>").text("[" + plugins + "插件]"))
  }
  $card.append($name)
  return $card
}

// 获取示例页面地址（与旧版逻辑保持一致）
function getEditorURL(example) {
  let editorUrl = window.editorUrl + "?id=" + example.main
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    editorUrl = window.readUrl + "?id=" + example.main
  }
  if (window.autoShowCode) {
    editorUrl += "&code=true"
  }
  if (example.params) {
    editorUrl += "&" + example.params + "&name=" + encodeURIComponent(example.fullName)
  }
  return editorUrl
}

function getPluginNameByLibs(libs) {
  if (!libs) {
    return false
  }
  for (let i = 0; i < libs.length; i++) {
    const lib = libs[i]
    if (lib.indexOf("mars2d-") === 0) {
      return lib.replace("mars2d-", "")
    }
  }
  return false
}

/* ---------------- 工具条 ---------------- */
function initToolbar() {
  const $input = $("#search-input")
  const $clear = $("#search-clear")

  $input.on("input", function () {
    applyFilter($input.val())
  })
  $input.on("keyup", function (event) {
    if (event.key === "Enter") {
      applyFilter($input.val())
    }
  })
  $("#search-btn").on("click", function () {
    applyFilter($input.val())
  })
  $clear.on("click", function () {
    $input.val("")
    applyFilter("")
    $input.trigger("focus")
  })

  $("#guide-btn").on("click", function (event) {
    event.stopPropagation()
    toggleGuide()
  })
  $("#guide-panel").on("click", function (event) {
    event.stopPropagation()
  })
  $(document).on("click", function () {
    setGuideOpen(false)
  })
  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      setGuideOpen(false)
      closeDrawer(true)
    }
  })
}

function matchesKeyword(item, keyword) {
  const fields = [item.name, item.main, item.api]
  return fields.some(function (field) {
    return (field || "").toLowerCase().indexOf(keyword) !== -1
  })
}

function applyFilter(value) {
  currentKeyword = (value || "").trim().toLowerCase()
  const $input = $("#search-input")
  const $clear = $("#search-clear")

  $("#search-input").val(value || "")
  $clear.prop("hidden", !currentKeyword)
  $("#result-hint").prop("hidden", !currentKeyword)

  if (!currentKeyword) {
    viewConfig = exConfig
    renderContent(exConfig)
    renderSidebar(exConfig)
  } else {
    viewConfig = exConfig
      .map(function (item) {
        const groups = (item.children || [])
          .map(function (group) {
            const cards = (group.children || []).filter(function (card) {
              return isVisible(card) && matchesKeyword(card, currentKeyword)
            })
            if (!cards.length) {
              return null
            }
            return Object.assign({}, group, { children: cards, count: cards.length })
          })
          .filter(function (group) {
            return group
          })
        if (!groups.length) {
          return null
        }
        return Object.assign({}, item, {
          children: groups,
          count: groups.reduce(function (sum, group) {
            return sum + group.count
          }, 0)
        })
      })
      .filter(function (item) {
        return item
      })

    renderContent(viewConfig)
    renderSidebar(viewConfig)
    $("#result-count").text(countVisible(viewConfig))
  }
}

function clearSearch() {
  currentKeyword = ""
  $("#search-input").val("")
  $("#search-clear").prop("hidden", true)
  $("#result-hint").prop("hidden", true)
  viewConfig = exConfig
  renderContent(exConfig)
  renderSidebar(exConfig)
}

/* ---------------- 说明浮层 ---------------- */
function toggleGuide() {
  setGuideOpen($("#guide-panel").prop("hidden"))
}

function setGuideOpen(open) {
  $("#guide-panel").prop("hidden", !open)
  $("#guide-btn").attr("aria-expanded", open ? "true" : "false")
}

/* ---------------- 分类抽屉（窄屏） ---------------- */
let drawerQuery = null

function initDrawer() {
  $("#mobile-filter-btn").on("click", function () {
    if ($("#category-panel").hasClass("is-open")) {
      closeDrawer(true)
    } else {
      openDrawer()
    }
  })
  $("#sidebar-mask").on("click", function () {
    closeDrawer(true)
  })

  if (window.matchMedia) {
    drawerQuery = window.matchMedia("(max-width: 1100px)")
    drawerQuery.addEventListener("change", updateDrawerA11y)
  }
  updateDrawerA11y()
}

function openDrawer() {
  $("#category-panel").addClass("is-open")
  $("#sidebar-mask").prop("hidden", false)
  $("#mobile-filter-btn").attr("aria-expanded", "true")
  updateDrawerA11y()
  const first = document.querySelector("#sidebar-menu .side1-item")
  if (first) {
    first.focus()
  }
}

function closeDrawer(restoreFocus) {
  if (!$("#category-panel").hasClass("is-open")) {
    return
  }
  $("#category-panel").removeClass("is-open")
  $("#sidebar-mask").prop("hidden", true)
  $("#mobile-filter-btn").attr("aria-expanded", "false")
  updateDrawerA11y()
  if (restoreFocus) {
    document.getElementById("mobile-filter-btn").focus()
  }
}

// 抽屉关闭时加 inert，避免键盘焦点落到屏外内容
function updateDrawerA11y() {
  const isMobile = drawerQuery ? drawerQuery.matches : window.innerWidth <= 1100
  const isOpen = $("#category-panel").hasClass("is-open")
  if (isMobile && !isOpen) {
    document.getElementById("category-panel").setAttribute("inert", "true")
  } else {
    document.getElementById("category-panel").removeAttribute("inert")
  }
}

/* ---------------- 顶栏 ---------------- */
function initHeader() {
  $("#nav-toggle").on("click", function () {
    if ($("#mobile-menu").prop("hidden")) {
      $("#mobile-menu").prop("hidden", false)
      $(this).attr("aria-expanded", "true").addClass("is-open")
      $("#nav-toggle").attr("aria-label", "关闭导航")
      const first = document.querySelector("#mobile-menu .mobile-nav-item")
      if (first) {
        first.focus()
      }
    } else {
      closeMobileMenu(true)
    }
  })

  $(document).on("pointerdown", function (event) {
    if ($("#mobile-menu").prop("hidden")) {
      return
    }
    if (!document.getElementById("site-header").contains(event.target)) {
      closeMobileMenu()
    }
  })

  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      closeMobileMenu(true)
    }
  })

  $(window).on("resize", function () {
    if (window.innerWidth > 820) {
      closeMobileMenu()
    }
  })
}

function closeMobileMenu(restoreFocus) {
  if ($("#mobile-menu").prop("hidden")) {
    return
  }
  $("#mobile-menu").prop("hidden", true)
  $("#nav-toggle").attr("aria-expanded", "false").attr("aria-label", "展开导航").removeClass("is-open")
  if (restoreFocus) {
    document.getElementById("nav-toggle").focus()
  }
}

/* ---------------- 定位与下载 ---------------- */
function scrollToSection(id) {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function scrollToHash() {
  const hash = (location.hash || "").replace("#", "")
  if (!hash) {
    return
  }
  const target = document.getElementById(hash)
  if (target) {
    window.setTimeout(function () {
      target.scrollIntoView({ block: "start" })
    }, 100)
  }
}

function initDownloads() {
  $("#download-txt").on("click", function () {
    downloadFile("Mars2D功能清单.txt", getAllName())
  })
  $("#download-csv").on("click", function () {
    downloadFile("Mars2D功能清单.csv", getVerDiff())
  })
}

function downloadFile(fileName, content) {
  const isCsv = fileName.indexOf(".csv") !== -1
  const blob = new Blob([isCsv ? "\ufeff" + content : content], {
    type: isCsv ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8"
  })
  const aLink = document.createElement("a")
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.style.display = "none"
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
  URL.revokeObjectURL(aLink.href)
}

function getStandardName(item) {
  let name = item.name || ""
  if (name.indexOf("Demo") !== -1 || name.indexOf("demo") !== -1) {
    return false
  }
  const idx = name.indexOf("(")
  if (idx !== -1) {
    name = name.substring(0, idx)
  }
  return name
}

function getVerDiff() {
  let text = "序号,分类,子分类,功能名称,示例ID\n"
  let index = 0
  const cache = {}
  exConfig.forEach(function (item) {
    ;(item.children || []).forEach(function (group) {
      ;(group.children || []).filter(isVisible).forEach(function (card) {
        const name = getStandardName(card)
        if (!name || cache[name]) {
          return
        }
        cache[name] = true
        index++
        text += index + "," + item.name + "," + group.name + "," + name + "," + card.main + "\n"
      })
    })
  })
  return text
}

function getAllName() {
  let text = "Mars2D功能清单："
  let index1 = 0
  const cache = {}
  exConfig.forEach(function (item) {
    const groups = (item.children || []).filter(function (group) {
      return (group.children || []).some(isVisible)
    })
    if (!groups.length) {
      return
    }
    index1++
    text += "\n\n功能 " + index1 + "  " + item.name
    let index2 = 0
    groups.forEach(function (group) {
      index2++
      text += "\n功能 " + index1 + "." + index2 + "  " + group.name + "："
      let index3 = 0
      ;(group.children || []).filter(isVisible).forEach(function (card) {
        const name = getStandardName(card)
        if (!name || cache[name]) {
          return
        }
        cache[name] = true
        index3++
        text += index3 === 1 ? name : "," + name
      })
    })
  })
  return text
}