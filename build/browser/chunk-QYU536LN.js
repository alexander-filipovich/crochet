import{E as l,F as a,J as p,R as i}from"./chunk-54ZSE74Z.js";var v={};function C(s,e){let t=0;for(let o=0;o<e;o++)t=t*31+s[o].uid>>>0;return v[t]||d(s,t)}function d(s,e){let t={},o=0;for(let r=0;r<16;r++){let u=r<s.length?s[r]:p.EMPTY.source;t[o++]=u.source,t[o++]=u.style}let n=new i(t);return v[e]=n,n}var c=class{constructor(e){this._canvasPool=Object.create(null),this.canvasOptions=e||{},this.enableFullScreen=!1}_createCanvasAndContext(e,t){let o=l.get().createCanvas();o.width=e,o.height=t;let n=o.getContext("2d");return{canvas:o,context:n}}getOptimalCanvasAndContext(e,t,o=1){e=Math.ceil(e*o-1e-6),t=Math.ceil(t*o-1e-6),e=a(e),t=a(t);let n=(e<<17)+(t<<1);this._canvasPool[n]||(this._canvasPool[n]=[]);let r=this._canvasPool[n].pop();return r||(r=this._createCanvasAndContext(e,t)),r}returnCanvasAndContext(e){let{width:t,height:o}=e.canvas,n=(t<<17)+(o<<1);this._canvasPool[n].push(e)}clear(){this._canvasPool={}}},G=new c;export{C as a,G as b};