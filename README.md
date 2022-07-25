 
<p align="center">
<img src="http://mars2d.cn/logo.png" width="300px" />
</p>

<p align="center">基于传统JS技术栈的 Mars2D🌎功能示例</p>


<p align="center">
<a target="_black" href="https://github.com/marsgis/mars2d">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/mars2d?style=flat&logo=github">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars2d">
<img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars2d?style=flat&logo=npm">
</a>
<a target="_black" href="https://www.npmjs.com/package/mars2d">
<img alt="Npm version" src="https://img.shields.io/npm/v/mars2d.svg?style=flat&logo=npm&label=version"/>
</a>
</p>


 基于原生JS开发的功能示例。
 
 

## 项目介绍
 
 这是一个基于`原生JS`开发的 mars2d 功能示例 演示项目。

 > 如果您不熟悉原生JS，对Vue比较熟悉，可以阅读：[功能示例Vue版教程](http://mars2d.cn/dev/guide/start/example.html)

 ## 项目特性 
- **独立页面**：每一个页面是一个单独的示例，依赖少，独立运行。
- **适合不同技术栈**: 原生JS开发, 适合不同技术栈用户理解



## 下载运行项目
 
### 下载代码
- [Github](https://github.com/marsgis/mars2d-es5-example)

```
git clone git@github.com:marsgis/mars2d-es5-example.git
```

- [Gitee](https://gitee.com/marsgis/mars2d-es5-example)：国内码云，下载速度快些。

```
git clone git@gitee.com:marsgis/mars2d-es5-example.git
``` 

- 如果本地没有git软件，可以浏览器输入[https://github.com/marsgis/mars2d-es5-example](https://github.com/marsgis/mars2d-es5-example)地址后，按下图下载zip包。

 ![image](http://mars2d.cn/dev/img/guide/start-example-down.jpg)

  
### 运行环境
运行前建议从[http://mars2d.cn/download.html](http://mars2d.cn/download.html)下载最新mars2d类库后覆盖至`lib/`目录下，更新mars2d为最新版本。

### 运行方式1：使用vscode及其插件
 
在任意开发编辑器（如vscode等）或http服务器(如node、nginx、tomcat、IIS等)下直接运行浏览`index.html`或example目录下各对应示例页面即可。

建议使用VScode工具打开代码目录（请参考[开发环境搭建教程](/guide/start/env.html)安装好VScode 及 Live Server插件）。
 
 参考下图通过Live Server访问各页面 

 ![image](http://mars2d.cn/dev/img/guide/start-example-run.jpg) 

  
### 运行方式2：运行npm命令

#### 首次运行前安装依赖
```
npm install

//或使用代理
npm i --registry=http://registry.taobao.org
```

#### 启动开发环境
```
npm run serve
```

#### 编译构建
```
npm run build //编译后生成在dist目录，拷贝出去发布即可
npm run serve:dist  //测试dist运行状态
```

 


### 运行效果   
 [在线体验](http://marsgis.gitee.io/mars2d-es5-example/)  

 ![image](http://mars2d.cn/dev/img/guide/start-example-es5.jpg) 


 


## 如何反馈问题？
- 发现您发现项目中存在的问题或者需要优化的地方；
- 如果您有一些自己全新编写的示例，希望也开源与大家分享。

提交方式：
- 欢迎在github或gitee上[提交PR](https://www.baidu.com/s?wd=在GitHub上提交PR) 
- 如果对git不熟悉，也可以整理示例代码发送邮件到 wh@marsgis.cn 由我们来整理集成。


## 项目架构


### 主要目录说明
```
mars2d-es5-example
└───data                列表配置信息及截图
│───example             示例代码，每个示例页面可以单独运行【重要】
│───lib                 示例依赖资源
│   └─include-lib.js    lib资源统一配置文件
│───static              列表页、编辑页对应js、css
└───index.html       列表页
```

与示例相关的2个主要目录是：`example`、`lib`。


#### include-lib.js文件说明 

我们当前原生JS版本`功能示例`页面，第三方类库及我们的sdk类库都存放在lib目录下，每个目录均有`README.md`文件说明该类库的github地址、官网和用途等信息。

 ![image](http://mars2d.cn/dev/img/guide/start-includeLib-ml.jpg) 

为了方便切换和引入第3方lib，我们编写了一个独立的js文件[include-lib.js](http://mars2d.cn/lib/include-lib.js)来统一调用使用第3方lib,在需要的页面按下面方式引入lib：
```html
<!--第三方lib-->
<script type="text/javascript" src="/lib/include-lib.js" libpath="/lib/"
    include="font-awesome,mars2d"></script>
```
该方式等价于（如不习惯include-lib.js，也可以改为下面演示的直接引入方式）： 

```html
<!--对应font-awesome-->
<link rel="stylesheet" href="../lib/fonts/font-awesome/css/font-awesome.min.css">

<!--对应turf-->
<script type="text/javascript" src="../lib/turf/turf.min.js"></script>

<!--对应mars2d-->
<link rel="stylesheet" href="../lib/Cesium/Widgets/widgets.css">
<script type="text/javascript" src="../lib/Cesium/Cesium.js"></script>
<link rel="stylesheet" href="../lib/mars2d/mars2d.css">
<script type="text/javascript" src="../lib/mars2d/mars2d.js"></script>
```
 
 
## 添加新的示例
复制`example\00_model.html`文件后改名，并修改代码即可。



## 阅读示例源码和调试学习
 示例的目的是演示平台的每个功能点，可以按需求或兴趣去学习每一个示例，
- （1）学习中可以查询相关类的API文档
- （2）尝试修改源码中参数、方法等，来体验不同的呈现效果。


## 开发中常见问题


### 1. 局域网离线使用时注意事项
 平台所有代码层面来说支持离线运行和使用的，但需要注意的是离线时的地图服务的相关处理。
 
 如果局域网内有相关地形、卫星底图服务可以按内网服务类型和URL地址替换下`config.json`或`构造Map的代码中`的默认地形和底图。

 如果局域网内没有相关服务，可以按下面处理：
- 修改config.json中`terrain`配置中，将已有的`"show": true`配置，改为`"show": false` 
- 修改config.json中`basemaps`数组配置中，将已有的`"show": true`的图层，将该值改为`"show": false` ，并将单张图片或离线地图加上`"show": true`，并修改相关URL地址。
- 您也可以参考教程[发布三维数据服务](/guide/data/server.html)进行部署离线地图服务，里面也有一些示例离线数据。



## Mars2D 是什么 
  `Mars2D平台` 是[火星科技](http://marsgis.cn/)研发的一款免费的二维地图客户端开发平台，基于[Leaflet](http://leafletjs.com/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，提供了全新的大数据可视化、实时流数据可视化功能，通过本平台可快速实现浏览器和移动端上美观、流畅的地图呈现与空间分析，完成平台在不同行业的灵活应用。


### 相关网站 
- Mars2D官网：[http://mars2d.cn](http://mars2d.cn)  

- Mars2D开源项目列表：[https://github.com/marsgis/mars2d](https://github.com/marsgis/mars2d)


## 版权说明
1. Mars2D平台由[火星科技](http://marsgis.cn/)自主研发，拥有所有权利。
2. 任何个人或组织可以在遵守相关要求下可以免费无限制使用。
