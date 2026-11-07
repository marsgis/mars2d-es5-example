/*!
 * @marsgis/editor v1.5.4
 * 通用示例编辑器容器，用于展示Mars2D+Mars3D平台的功能示例源码
 * Build: 2026-11-06 21:56:50
 */
var MarsgisEditorLoader=function(r){Object.defineProperties(r,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});var e=document.currentScript,o=e&&e.src?new URL(".",e.src).href:"",t=null;async function n(r){const e=window.MarsgisEditor;if(e&&e.Editor)return e;var t;await(t=r.editorUrl||(o?new URL("editor.iife.js",o).href:"./editor.iife.js"),new Promise((r,e)=>{const o=document.createElement("script");o.src=t,o.onload=()=>r(),o.onerror=()=>{o.remove(),e(new Error(`脚本加载失败：${t}`))},document.head.appendChild(o)}));const n=window.MarsgisEditor;if(!n||!n.Editor)throw new Error("编辑器加载失败：未找到 MarsgisEditor");return n}function i(r={}){return t||(t=(async()=>n(r))().catch(r=>{throw t=null,r}))}var d={load:i};return r.default=d,r.load=i,r}({});