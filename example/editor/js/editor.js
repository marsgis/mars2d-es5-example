/* 2017-12-4 15:15:45 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */

let protocol = window.location.protocol;
if (protocol == "https:") {
  window.location.href = window.location.href.replace("https", "http");
}

$(document).ready(function () {
  initPage();
  bindEvents();

  // 快捷键
  document.addEventListener("keydown", function (e) {
    if (!e.ctrlKey) {
      return;
    }
    const keyCode = String.fromCharCode(e.keyCode).toLowerCase();
    if (keyCode === "s") {
      run();
      e.preventDefault();
    } else if (keyCode === "r") {
      reload();
      e.preventDefault();
    }
  });
});

let jsEditor;
let containExamples = true;

function initPage() {
  initEditor();
  screenResize();
}

function screenResize() {
  window.onresize = function () {
    mapHeight();
  };
}

let currExampleItem;

function findConfig(locationParam, search) {
  let exConfig = haoutil.storage.get("example-config");
  if (!exConfig) {
    $.ajax({
      type: "get",
      dataType: "json",
      url: window.exampleConfig || "/config/example.json",
      success: function (result) {
        // eslint-disable-next-line no-undef
        exConfig = exampleData(result);

        haoutil.storage.add("example-config", JSON.stringify(exConfig));
        findConfig(locationParam, search);
      },
      error: function (error) {
        console.log("加载JSON出错", error);
        haoutil.alert(error?.message, "出错了");
      },
    });
    return;
  }

  exConfig = JSON.parse(exConfig);
  if (!exConfig || !exConfig.length) {
    return;
  }

  for (let index1 = 0; index1 < exConfig.length; index1++) {
    let item = exConfig[index1];
    if (!item.children) {
      return;
    }
    for (let index2 = 0; index2 < item.children.length; index2++) {
      let item2 = item.children[index2];
      if (!item2.children) {
        return;
      }
      for (let index3 = 0; index3 < item2.children.length; index3++) {
        let item3 = item2.children[index3];
        if (item3.main_es5 == locationParam) {
          currExampleItem = item3;
          $("#lblFullName").html(item3.fullName);
          return;
        }
      }
    }
  }
}

//初始化编辑器
function initCodeEditor() {
  let editorConfig = {
    theme: "vs-dark",
    formatOnPaste: true,
    fontSize: 14,
    scrollbar: {
      verticalScrollbarSize: 2,
    },
  };

  // eslint-disable-next-line no-undef
  jsEditor = monaco.editor.create(document.getElementById("editor"), {
    value: $("#editor").val(),
    language: "html",
    ...editorConfig,
  });
}

function setEditorValue(value) {
  if (jsEditor) {
    jsEditor.setValue(value);
  }
}

//初始化编辑器以及预览内容
function initEditor() {
  loadExampleHtml();
  initCodeEditor();
}

function loadExampleHtml() {
  let locationParam = getLocationParam();
  if (!locationParam) {
    return;
  }

  findConfig(locationParam, window.location.search);

  // eslint-disable-next-line no-undef
  locationParam = id2FileName(locationParam);

  let name = haoutil.system.getRequestByName("name");
  if (name) {
    $("#lblFullName").html(name);
  }

  let href = window.location.pathname;
  let mapUrl = href.substr(0, href.lastIndexOf("/") + 1);
  mapUrl = mapUrl + locationParam + window.location.search;
  if (!mapUrl) {
    return;
  }

  let cacheVersion = "20210501";
  if (mapUrl.indexOf("?") == -1) {
    mapUrl += "?time=" + cacheVersion;
  } else if (mapUrl.indexOf("time=" + cacheVersion) == -1) {
    mapUrl += "&time=" + cacheVersion;
  }

  console.log("加载示例页面：" + mapUrl);

  let html = $.ajax({
    url: mapUrl,
    async: false,
    error: function (error) {
      haoutil.msg("该页面不存在，请检查地址！");
      html = "";
    },
  }).responseText;
  if (html && html != "") {
    html = html.replace(new RegExp(/[\s]*<meta[^>]*?\/?>/, "gm"), "");

    $("#editor").val(html);
    loadPreview(html);
  }
}

function getLocationParam() {
  let id = haoutil.system.getRequestByName("id");
  if (id) {
    return id;
  }

  let param = window.location.toString();
  if (param.indexOf("#") === -1) {
    return "";
  }
  param = param.split("#");
  if (param && param.length > 0) {
    return param[1];
  }
}

//运行代码
function run() {
  let iframeContent = $("#editor").val();
  if (jsEditor) {
    iframeContent = jsEditor.getValue();
  }
  loadPreview(iframeContent);
}

//填充预览效果内容
function loadPreview(content) {
  let iFrame = createIFrame(),
    iframeDocument = iFrame.contentWindow.document;

  iframeDocument.open();
  iframeDocument.write(content);
  iframeDocument.close();

  let doc = document;
  iFrame.addEventListener("load", function () {
    mapHeight();
    //setTimeout(function () {
    //    doc.title = iframeDocument.title;
    //}, 100);
  });
  mapHeight();
}

function loadIFrameForSrc(url) {
  createIFrame();
  $("#innerPage").attr("src", url);

  mapHeight();
}

function createIFrame() {
  let preViewPane = $("#previewPane");
  preViewPane.empty();
  let iframe = document.createElement("iframe");
  $(iframe).attr("id", "innerPage");
  $(iframe).attr("name", "innerPage");
  preViewPane.append(iframe);
  return iframe;
}

//重置编辑器
function reload() {
  setEditorValue($("#editor").val());
  run();
}

// function initSelect() {
//   let hash = window.location.hash
//   let id
//   if (hash.indexOf('#') === -1) {
//     id = $('section#sidebar .thirdMenu a.link').first().attr('id')
//     window.location.hash = id ? '#' + id : window.location.hash
//   } else {
//     id = hash.split('#')[1]
//   }
//   selectMenu(id)
// }

function mapHeight() {
  let doc = $("#innerPage").contents();
  doc.find("html").height("100%");
  doc.find("body").height("100%");
}

function bindEvents() {
  $("#sidebar ul.third-menu a").click(function (evt) {
    let target = $(evt.target).parent().parent();
    let nodeId = evt.target.id;
    //如果点击的是span节点还要往上一层
    if (evt.target.localName === "span") {
      nodeId = target.attr("id");
    }

    if (nodeId) {
      //阻止冒泡防止上层事件响应导致修改url hash值
      evt.preventDefault();
      window.location.hash = "#" + nodeId;
      initEditor();
      evt.stopPropagation();
    }
  });
  let codePane = $("#codePane");
  let previewContent = $("#previewContent");
  let expand = !!1;
  $("#editorControl").click(function () {
    if (expand) {
      //编辑器和预览宽度5:7
      $(this).text(" 隐藏源码");
      $(this).addClass("fa-align-right");
      $(this).removeClass("fa-align-left");
      codePane.show(10, function () {
        previewContent.removeClass("col-md-12");
        previewContent.addClass("col-md-7");
        codePane.addClass("col-md-5");

        if (jsEditor) {
          jsEditor.layout();
        }
      });
    } else {
      //预览独占一行
      $(this).text(" 查看源码").css({ left: "0px" });
      $(this).removeClass("fa-align-right");
      $(this).addClass("fa-align-left");
      codePane.hide(200, function () {
        codePane.removeClass("col-md-5");
        previewContent.removeClass("col-md-7");
        previewContent.addClass("col-md-12");
      });
    }
    expand = !expand;
  });

  $("#toVue").click(function () {
    let item = currExampleItem;
    if (item) {
      let url = "/editor-vue.html?id=" + encodeURI(item.main);

      if (item.params) {
        url += `&${item.params}&name=${item.fullName}`;
      }
      window.open(url, "_blank");
    } else {
      haoutil.msg("配置信息不存在，请返回列表页面重新进入");
    }
  });

  window.onresize = function () {
    if (jsEditor) {
      jsEditor.layout();
    }
  };

  if (haoutil.system.getRequestByName("code")) {
    $("#editorControl").click();
  }
}
