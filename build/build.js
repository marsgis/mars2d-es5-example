/* eslint-disable */
const fs = require("fs-extra")
const path = require("path")
const fileQueen = []

const inputDir = path.resolve("./example")

;(async function () {
  readFolder(inputDir)
  while (fileQueen.length > 0) {
    const fPath = fileQueen.shift()
    const codeBuffer = await fs.readFileSync(fPath)
    let code = codeBuffer.toString()
    // 替换let const
    code = code.replace(new RegExp("export let ", "gm"), "var ")
    code = code.replace(new RegExp("export const ", "gm"), "var ")

    // 浏览器中运行时，删除export import
    code = code.replace(new RegExp("export ", "gm"), "")
    code = code.replace(new RegExp("import ", "gm"), "// import ")

    // 删除const L = mars2d.L
    code = code.replace("const L = mars2d.L", "")
    // 删除const Cesium = mars3d.Cesium
    code = code.replace("const Cesium = mars3d.Cesium", "")
    
    fs.writeFileSync(fPath, code)
  }
})()

function readFolder(dir) {
  const files = fs.readdirSync(dir)

  files.forEach(function (name) {
    const fullPath = path.join(dir, name)
    const stat = fs.statSync(fullPath)
    if (stat.isFile()) {
      // 文件
      if (name === "map.js") {
        fileQueen.push(fullPath)
      }
    } else if (stat.isDirectory()) {
      // 目录
      readFolder(fullPath)
    }
  })
}
