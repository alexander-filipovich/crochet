import{$ as ge,A as Ee,B as Oe,C as Ae,D as v,E as ie,G as b,I as Ie,J as p,L as De,M as B,N as U,O as me,Q as Fe,R as He,T as g,U as ze,V as xe,W as ne,X as Le,Z as oe,_ as We,a as d,aa as ae,b as C,ba as ve,c as J,ca as le,f as G,g as u,h as X,i as Q,j as _,k as Ge,l as x,la as ue,m as w,ma as Ve,n as Z,o as ee,q as te,r as y,s as k,t as re,w as Be,x as se,y as Ue}from"./chunk-VKNI74MO.js";var E;function de(){if(typeof E=="boolean")return E;try{E=new Function("param1","param2","param3","return param1[param2] === param3;")({a:"b"},"a","b")===!0}catch{E=!1}return E}var T=(s=>(s[s.NONE=0]="NONE",s[s.COLOR=16384]="COLOR",s[s.STENCIL=1024]="STENCIL",s[s.DEPTH=256]="DEPTH",s[s.COLOR_DEPTH=16640]="COLOR_DEPTH",s[s.COLOR_STENCIL=17408]="COLOR_STENCIL",s[s.DEPTH_STENCIL=1280]="DEPTH_STENCIL",s[s.ALL=17664]="ALL",s))(T||{});var S=class{constructor(e){this.items=[],this._name=e}emit(e,t,r,i,n,o,l,a){let{name:c,items:h}=this;for(let f=0,m=h.length;f<m;f++)h[f][c](e,t,r,i,n,o,l,a);return this}add(e){return e[this._name]&&(this.remove(e),this.items.push(e)),this}remove(e){let t=this.items.indexOf(e);return t!==-1&&this.items.splice(t,1),this}contains(e){return this.items.indexOf(e)!==-1}removeAll(){return this.items.length=0,this}destroy(){this.removeAll(),this.items=null,this._name=null}get empty(){return this.items.length===0}get name(){return this._name}};var mt=["init","destroy","contextChange","resolutionChange","reset","renderEnd","renderStart","render","update","postrender","prerender"],xt=(()=>{let s=class je extends Q{constructor(t){super(),this.runners=Object.create(null),this.renderPipes=Object.create(null),this._initOptions={},this._systemsHash=Object.create(null),this.type=t.type,this.name=t.name;let r=[...mt,...t.runners??[]];this._addRunners(...r),this._addSystems(t.systems),this._addPipes(t.renderPipes,t.renderPipeAdaptors),this._unsafeEvalCheck()}init(){return G(this,arguments,function*(t={}){for(let r in this._systemsHash){let n=this._systemsHash[r].constructor.defaultOptions;t=d(d({},n),t)}t=d(d({},je.defaultOptions),t),this._roundPixels=t.roundPixels?1:0;for(let r=0;r<this.runners.init.items.length;r++)yield this.runners.init.items[r].init(t);this._initOptions=t})}render(t,r){let i=t;if(i instanceof v&&(i={container:i},r&&(ee(Z,"passing a second argument is deprecated, please use render options instead"),i.target=r.renderTexture)),i.target||(i.target=this.view.renderTarget),i.target===this.view.renderTarget&&(this._lastObjectRendered=i.container,i.clearColor=this.background.colorRgba),i.clearColor){let n=Array.isArray(i.clearColor)&&i.clearColor.length===4;i.clearColor=n?i.clearColor:_.shared.setValue(i.clearColor).toArray()}i.transform||(i.container.updateLocalTransform(),i.transform=i.container.localTransform),this.runners.prerender.emit(i),this.runners.renderStart.emit(i),this.runners.render.emit(i),this.runners.renderEnd.emit(i),this.runners.postrender.emit(i)}resize(t,r,i){this.view.resize(t,r,i),this.emit("resize",this.view.screen.width,this.view.screen.height)}clear(t={}){let r=this;t.target||(t.target=r.renderTarget.renderTarget),t.clearColor||(t.clearColor=this.background.colorRgba),t.clear??(t.clear=T.ALL);let{clear:i,clearColor:n,target:o}=t;_.shared.setValue(n??this.background.colorRgba),r.renderTarget.clear(o,i,_.shared.toArray())}get resolution(){return this.view.resolution}set resolution(t){this.view.resolution=t,this.runners.resolutionChange.emit(t)}get width(){return this.view.texture.frame.width}get height(){return this.view.texture.frame.height}get canvas(){return this.view.canvas}get lastObjectRendered(){return this._lastObjectRendered}get renderingToScreen(){return this.renderTarget.renderingToScreen}get screen(){return this.view.screen}_addRunners(...t){t.forEach(r=>{this.runners[r]=new S(r)})}_addSystems(t){let r;for(r in t){let i=t[r];this._addSystem(i.value,i.name)}}_addSystem(t,r){let i=new t(this);if(this[r])throw new Error(`Whoops! The name "${r}" is already in use`);this[r]=i,this._systemsHash[r]=i;for(let n in this.runners)this.runners[n].add(i);return this}_addPipes(t,r){let i=r.reduce((n,o)=>(n[o.name]=o.value,n),{});t.forEach(n=>{let o=n.value,l=n.name,a=i[l];this.renderPipes[l]=new o(this,a?new a:null)})}destroy(t=!1){this.runners.destroy.items.reverse(),this.runners.destroy.emit(t),Object.values(this.runners).forEach(r=>{r.destroy()}),this._systemsHash=null,this.renderPipes=null}generateTexture(t){return this.textureGenerator.generateTexture(t)}get roundPixels(){return!!this._roundPixels}_unsafeEvalCheck(){if(!de())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}};return s.defaultOptions={resolution:1,failIfMajorPerformanceCaveat:!1,roundPixels:!1},s})(),Lt=xt;var O=class{constructor(e){this._renderer=e}addRenderable(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){e.isRenderable&&e.render(this._renderer)}destroy(){this._renderer=null}};O.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"customRender"};function ce(s,e){let t=s.instructionSet,r=t.instructions;for(let i=0;i<t.instructionSize;i++){let n=r[i];e[n.renderPipeId].execute(n)}}var A=class{constructor(e){this._renderer=e}addRenderGroup(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){e.isRenderable&&(this._renderer.globalUniforms.push({worldTransformMatrix:e.worldTransform,worldColor:e.worldColorAlpha}),ce(e,this._renderer.renderPipes),this._renderer.globalUniforms.pop())}destroy(){this._renderer=null}};A.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"renderGroup"};function Ne(s,e){let t=s.root,r=s.instructionSet;r.reset(),e.batch.buildStart(r),e.blendMode.buildStart(),e.colorMask.buildStart(),t.sortableChildren&&t.sortChildren(),$e(t,r,e,!0),e.batch.buildEnd(r),e.blendMode.buildEnd(r)}function M(s,e,t){s.globalDisplayStatus<7||!s.includeInBuild||(s.sortableChildren&&s.sortChildren(),s.isSimple?gt(s,e,t):$e(s,e,t,!1))}function gt(s,e,t){if(s.renderPipeId&&(t.blendMode.setBlendMode(s,s.groupBlendMode,e),s.didViewUpdate=!1,t[s.renderPipeId].addRenderable(s,e)),!s.isRenderGroupRoot){let r=s.children,i=r.length;for(let n=0;n<i;n++)M(r[n],e,t)}}function $e(s,e,t,r){if(!r&&s.isRenderGroupRoot)t.renderGroup.addRenderGroup(s.renderGroup,e);else{for(let o=0;o<s.effects.length;o++){let l=s.effects[o];t[l.pipe].push(l,s,e)}let i=s.renderPipeId;i&&(t.blendMode.setBlendMode(s,s.groupBlendMode,e),s.didViewUpdate=!1,t[i].addRenderable(s,e));let n=s.children;if(n.length)for(let o=0;o<n.length;o++)M(n[o],e,t);for(let o=s.effects.length-1;o>=0;o--){let l=s.effects[o];t[l.pipe].pop(l,s,e)}}}function _e(s,e=[]){e.push(s);for(let t=0;t<s.renderGroupChildren.length;t++)_e(s.renderGroupChildren[t],e);return e}var vt=new v;function be(s,e=!1){_t(s);let t=s.childrenToUpdate,r=s.updateTick;s.updateTick++;for(let i in t){let n=t[i],o=n.list,l=n.index;for(let a=0;a<l;a++)Ke(o[a],r,0);n.index=0}if(e)for(let i=0;i<s.renderGroupChildren.length;i++)be(s.renderGroupChildren[i],e)}function _t(s){let e=s.root,t;if(s.renderGroupParent){let r=s.renderGroupParent;s.worldTransform.appendFrom(e.relativeGroupTransform,r.worldTransform),s.worldColor=xe(e.groupColor,r.worldColor),t=e.groupAlpha*r.worldAlpha}else s.worldTransform.copyFrom(e.localTransform),s.worldColor=e.localColor,t=e.localAlpha;t=t<0?0:t>1?1:t,s.worldAlpha=t,s.worldColorAlpha=s.worldColor+((t*255|0)<<24)}function Ke(s,e,t){if(e===s.updateTick)return;s.updateTick=e,s.didChange=!1;let r=s.localTransform;s.updateLocalTransform();let i=s.parent;if(i&&!i.isRenderGroupRoot?(t=t|s._updateFlags,s.relativeGroupTransform.appendFrom(r,i.relativeGroupTransform),t&&qe(s,i,t)):(t=s._updateFlags,s.relativeGroupTransform.copyFrom(r),t&&qe(s,vt,t)),!s.isRenderGroupRoot){let n=s.children,o=n.length;for(let a=0;a<o;a++)Ke(n[a],e,t);let l=s.renderGroup;s.renderPipeId&&!l.structureDidChange&&l.updateRenderable(s)}}function qe(s,e,t){if(t&Ee){s.groupColor=xe(s.localColor,e.groupColor);let r=s.localAlpha*e.groupAlpha;r=r<0?0:r>1?1:r,s.groupAlpha=r,s.groupColorAlpha=s.groupColor+((r*255|0)<<24)}t&Oe&&(s.groupBlendMode=s.localBlendMode==="inherit"?e.groupBlendMode:s.localBlendMode),t&Ae&&(s.globalDisplayStatus=s.localDisplayStatus&e.globalDisplayStatus),s._updateFlags=0}function Ye(s,e){let{list:t,index:r}=s.childrenRenderablesToUpdate,i=!1;for(let n=0;n<r;n++){let o=t[n];if(i=e[o.renderPipeId].validateRenderable(o),i)break}return s.structureDidChange=i,i}var bt=new x,I=class{constructor(e){this._renderer=e}render({container:e,transform:t}){e.isRenderGroup=!0;let r=e.parent,i=e.renderGroup.renderGroupParent;e.parent=null,e.renderGroup.renderGroupParent=null;let n=this._renderer,o=_e(e.renderGroup,[]),l=bt;t&&(l=l.copyFrom(e.renderGroup.localTransform),e.renderGroup.localTransform.copyFrom(t));let a=n.renderPipes;for(let c=0;c<o.length;c++){let h=o[c];h.runOnRender(),h.instructionSet.renderPipes=a,h.structureDidChange||Ye(h,a),be(h),h.structureDidChange?(h.structureDidChange=!1,Ne(h,a)):Tt(h),h.childrenRenderablesToUpdate.index=0,n.renderPipes.batch.upload(h.instructionSet)}n.globalUniforms.start({worldTransformMatrix:t?e.renderGroup.localTransform:e.renderGroup.worldTransform,worldColor:e.renderGroup.worldColorAlpha}),ce(e.renderGroup,a),a.uniformBatch&&a.uniformBatch.renderEnd(),t&&e.renderGroup.localTransform.copyFrom(l),e.parent=r,e.renderGroup.renderGroupParent=i}destroy(){this._renderer=null}};I.extension={type:[u.WebGLSystem,u.WebGPUSystem,u.CanvasSystem],name:"renderGroup"};function Tt(s){let{list:e,index:t}=s.childrenRenderablesToUpdate;for(let r=0;r<t;r++){let i=e[r];i.didViewUpdate&&s.updateRenderable(i)}}var D=class{constructor(e){this._gpuSpriteHash=Object.create(null),this._renderer=e}addRenderable(e,t){let r=this._getGpuSprite(e);e._didSpriteUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r)}updateRenderable(e){let t=this._gpuSpriteHash[e.uid];e._didSpriteUpdate&&this._updateBatchableSprite(e,t),t.batcher.updateElement(t)}validateRenderable(e){let t=e._texture,r=this._getGpuSprite(e);return r.texture._source!==t._source?!r.batcher.checkAndUpdateTexture(r,t):!1}destroyRenderable(e){let t=this._gpuSpriteHash[e.uid];y.return(t),this._gpuSpriteHash[e.uid]=null}_updateBatchableSprite(e,t){e._didSpriteUpdate=!1,t.bounds=e.bounds,t.texture=e._texture}_getGpuSprite(e){return this._gpuSpriteHash[e.uid]||this._initGPUSprite(e)}_initGPUSprite(e){let t=y.get(We);return t.renderable=e,t.texture=e._texture,t.bounds=e.bounds,t.roundPixels=this._renderer._roundPixels|e._roundPixels,this._gpuSpriteHash[e.uid]=t,e._didSpriteUpdate=!1,e.on("destroyed",()=>{this.destroyRenderable(e)}),t}destroy(){for(let e in this._gpuSpriteHash)y.return(this._gpuSpriteHash[e]);this._gpuSpriteHash=null,this._renderer=null}};D.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"sprite"};var F=class{constructor(e,t){this.state=ne.for2d(),this._batches=Object.create(null),this._geometries=Object.create(null),this.renderer=e,this._adaptor=t,this._adaptor.init(this)}buildStart(e){if(!this._batches[e.uid]){let t=new ze;this._batches[e.uid]=t,this._geometries[t.uid]=new Fe}this._activeBatch=this._batches[e.uid],this._activeGeometry=this._geometries[this._activeBatch.uid],this._activeBatch.begin()}addToBatch(e){this._activeBatch.add(e)}break(e){this._activeBatch.break(e)}buildEnd(e){let t=this._activeBatch,r=this._activeGeometry;t.finish(e),r.indexBuffer.setDataWithSize(t.indexBuffer,t.indexSize,!0),r.buffers[0].setDataWithSize(t.attributeBuffer.float32View,t.attributeSize,!1)}upload(e){let t=this._batches[e.uid],r=this._geometries[t.uid];t.dirty&&(t.dirty=!1,r.buffers[0].update(t.attributeSize*4))}execute(e){if(e.action==="startBatch"){let t=e.batcher,r=this._geometries[t.uid];this._adaptor.start(this,r)}this._adaptor.execute(this,e)}destroy(){this.state=null,this.renderer=null,this._adaptor.destroy(),this._adaptor=null;for(let e in this._batches)this._batches[e].destroy();this._batches=null;for(let e in this._geometries)this._geometries[e].destroy();this._geometries=null}};F.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"batch"};var yt=(()=>{let s=class Te extends Ve{constructor(t){t=d(d({},Te.defaultOptions),t),super(t),this.enabled=!0,this._state=ne.for2d(),this.padding=t.padding,typeof t.antialias=="boolean"?this.antialias=t.antialias?"on":"off":this.antialias=t.antialias,this.resolution=t.resolution,this.blendRequired=t.blendRequired,this.addResource("uTexture",0,1)}apply(t,r,i,n){t.applyFilter(this,r,i,n)}get blendMode(){return this._state.blendMode}set blendMode(t){this._state.blendMode=t}static from(t){let a=t,{gpu:r,gl:i}=a,n=J(a,["gpu","gl"]),o,l;return r&&(o=le.from(r)),i&&(l=ae.from(i)),new Te(d({gpuProgram:o,glProgram:l},n))}};return s.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1},s})(),Je=yt;var Xe=`in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha; 
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    original *= (alphaMul * masky.r * uAlpha * clip);

    finalColor = original;
}
`;var Qe=`in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`;var ye=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,  
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
};


@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{

  
  return gfu.uGlobalFrame.zw;
}
  
@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;

     var clip = step(3.5,
        step(maskClamp.x, filterUv.x) +
        step(maskClamp.y, filterUv.y) +
        step(filterUv.x, maskClamp.z) +
        step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    
    var npmAlpha = 0.0;

    var alphaMul = 1.0 - npmAlpha * (1.0 - mask.a);

    var a = (alphaMul * mask.r) * clip;

    return vec4(source.rgb, source.a) * a;
}`;var he=class extends Je{constructor(e){let a=e,{sprite:t}=a,r=J(a,["sprite"]),i=new Ie(t.texture),n=new oe({uFilterMatrix:{value:new x,type:"mat3x3<f32>"},uMaskClamp:{value:i.uClampFrame,type:"vec4<f32>"},uAlpha:{value:1,type:"f32"}}),o=le.from({vertex:{source:ye,entryPoint:"mainVertex"},fragment:{source:ye,entryPoint:"mainFragment"}}),l=ae.from({vertex:Qe,fragment:Xe,name:"mask-filter"});super(C(d({},r),{gpuProgram:o,glProgram:l,resources:{filterUniforms:n,uMaskTexture:t.texture.source}})),this.sprite=t,this._textureMatrix=i}apply(e,t,r,i){this._textureMatrix.texture=this.sprite.texture,e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=this.sprite.texture.source,e.applyFilter(this,t,r,i)}};var kt=new re,ke=class extends te{constructor(){super({filters:[new he({sprite:new De(p.EMPTY)})]})}get sprite(){return this.filters[0].sprite}set sprite(e){this.filters[0].sprite=e}},H=class{constructor(e){this._activeMaskStage=[],this._renderer=e}push(e,t,r){let i=this._renderer;if(i.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskBegin",mask:e,canBundle:!1,maskedContainer:t}),e.renderMaskToTexture){let n=e.mask;n.includeInBuild=!0,M(n,r,i.renderPipes),n.includeInBuild=!1}i.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskEnd",mask:e,maskedContainer:t,canBundle:!1})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"popMaskEnd",mask:e,canBundle:!1})}execute(e){let t=this._renderer,r=e.mask.renderMaskToTexture;if(e.action==="pushMaskBegin"){let i=y.get(ke);if(r){e.mask.mask.measurable=!0;let n=Be(e.mask.mask,!0,kt);e.mask.mask.measurable=!1,n.ceil();let o=ge.getOptimalTexture(n.width,n.height,1,!1);t.renderTarget.push(o,!0),t.globalUniforms.push({offset:n,worldColor:4294967295});let l=i.sprite;l.texture=o,l.worldTransform.tx=n.minX,l.worldTransform.ty=n.minY,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer,filterTexture:o})}else i.sprite=e.mask.mask,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer})}else if(e.action==="pushMaskEnd"){let i=this._activeMaskStage[this._activeMaskStage.length-1];r&&(t.renderTarget.pop(),t.globalUniforms.pop()),t.filter.push({renderPipeId:"filter",action:"pushFilter",container:i.maskedContainer,filterEffect:i.filterEffect,canBundle:!1})}else if(e.action==="popMaskEnd"){t.filter.pop();let i=this._activeMaskStage.pop();r&&ge.returnTexture(i.filterTexture),y.return(i.filterEffect)}}destroy(){this._renderer=null,this._activeMaskStage=null}};H.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"alphaMask"};var z=class{constructor(e){this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=e}buildStart(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}push(e,t,r){this._renderer.renderPipes.batch.break(r);let n=this._colorStack;n[this._colorStackIndex]=n[this._colorStackIndex-1]&e.mask;let o=this._colorStack[this._colorStackIndex];o!==this._currentColor&&(this._currentColor=o,r.add({renderPipeId:"colorMask",colorMask:o,canBundle:!1})),this._colorStackIndex++}pop(e,t,r){this._renderer.renderPipes.batch.break(r);let n=this._colorStack;this._colorStackIndex--;let o=n[this._colorStackIndex-1];o!==this._currentColor&&(this._currentColor=o,r.add({renderPipeId:"colorMask",colorMask:o,canBundle:!1}))}execute(e){this._renderer.colorMask.setMask(e.colorMask)}destroy(){this._colorStack=null}};z.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"colorMask"};var L=class{constructor(e){this._maskStackHash={},this._maskHash=new WeakMap,this._renderer=e}push(e,t,r){var i;let n=e,o=this._renderer;o.renderPipes.batch.break(r),o.renderPipes.blendMode.setBlendMode(n.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"pushMaskBegin",mask:e,canBundle:!1});let l=n.mask;l.includeInBuild=!0,this._maskHash.has(n)||this._maskHash.set(n,{instructionsStart:0,instructionsLength:0});let a=this._maskHash.get(n);a.instructionsStart=r.instructionSize,M(l,r,o.renderPipes),l.includeInBuild=!1,o.renderPipes.batch.break(r),r.add({renderPipeId:"stencilMask",action:"pushMaskEnd",mask:e,canBundle:!1});let c=r.instructionSize-a.instructionsStart-1;a.instructionsLength=c;let h=o.renderTarget.renderTarget.uid;(i=this._maskStackHash)[h]??(i[h]=0)}pop(e,t,r){let i=e,n=this._renderer;n.renderPipes.batch.break(r),n.renderPipes.blendMode.setBlendMode(i.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"popMaskBegin",canBundle:!1});let o=this._maskHash.get(e);for(let l=0;l<o.instructionsLength;l++)r.instructions[r.instructionSize++]=r.instructions[o.instructionsStart++];r.add({renderPipeId:"stencilMask",action:"popMaskEnd",canBundle:!1})}execute(e){var t;let r=this._renderer,i=r.renderTarget.renderTarget.uid,n=(t=this._maskStackHash)[i]??(t[i]=0);e.action==="pushMaskBegin"?(r.renderTarget.ensureDepthStencil(),r.stencil.setStencilMode(g.RENDERING_MASK_ADD,n),n++,r.colorMask.setMask(0)):e.action==="pushMaskEnd"?(r.stencil.setStencilMode(g.MASK_ACTIVE,n),r.colorMask.setMask(15)):e.action==="popMaskBegin"?(r.colorMask.setMask(0),n!==0?r.stencil.setStencilMode(g.RENDERING_MASK_REMOVE,n):(r.renderTarget.clear(null,T.STENCIL),r.stencil.setStencilMode(g.DISABLED,n)),n--):e.action==="popMaskEnd"&&(r.stencil.setStencilMode(g.MASK_ACTIVE,n),r.colorMask.setMask(15)),this._maskStackHash[i]=n}destroy(){this._renderer=null,this._maskStackHash=null,this._maskHash=null}};L.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"stencilMask"};var Ce=class Ze{constructor(){this.clearBeforeRender=!0,this._backgroundColor=new _(0),this.color=this._backgroundColor,this.alpha=1}init(e){e=d(d({},Ze.defaultOptions),e),this.clearBeforeRender=e.clearBeforeRender,this.color=e.background||e.backgroundColor||this._backgroundColor,this.alpha=e.backgroundAlpha,this._backgroundColor.setAlpha(e.backgroundAlpha)}get color(){return this._backgroundColor}set color(e){this._backgroundColor.setValue(e)}get alpha(){return this._backgroundColor.alpha}set alpha(e){this._backgroundColor.setAlpha(e)}get colorRgba(){return this._backgroundColor.toArray()}destroy(){}};Ce.extension={type:[u.WebGLSystem,u.WebGPUSystem,u.CanvasSystem],name:"background",priority:0};Ce.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};var et=Ce;var W={};X.handle(u.BlendMode,s=>{if(!s.name)throw new Error("BlendMode extension must have a name property");W[s.name]=s.ref},s=>{delete W[s.name]});var V=class{constructor(e){this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=e}setBlendMode(e,t,r){if(this._activeBlendMode===t){this._isAdvanced&&this._renderableList.push(e);return}this._activeBlendMode=t,this._isAdvanced&&this._endAdvancedBlendMode(r),this._isAdvanced=!!W[t],this._isAdvanced&&(this._beginAdvancedBlendMode(r),this._renderableList.push(e))}_beginAdvancedBlendMode(e){this._renderer.renderPipes.batch.break(e);let t=this._activeBlendMode;if(!W[t]){se(`Unable to assign BlendMode: '${t}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);return}this._filterHash[t]||(this._filterHash[t]=new te({filters:[new W[t]]}));let r={renderPipeId:"filter",action:"pushFilter",renderables:[],filterEffect:this._filterHash[t],canBundle:!1};this._renderableList=r.renderables,e.add(r)}_endAdvancedBlendMode(e){this._renderableList=null,this._renderer.renderPipes.batch.break(e),e.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}buildStart(){this._isAdvanced=!1}buildEnd(e){this._isAdvanced&&this._endAdvancedBlendMode(e)}destroy(){this._renderer=null,this._renderableList=null;for(let e in this._filterHash)this._filterHash[e].destroy();this._filterHash=null}};V.extension={type:[u.WebGLPipes,u.WebGPUPipes,u.CanvasPipes],name:"blendMode"};var we={png:"image/png",jpg:"image/jpeg",webp:"image/webp"},Se=class tt{constructor(e){this._renderer=e}_normalizeOptions(e,t={}){return e instanceof v||e instanceof p?d({target:e},t):d(d({},t),e)}image(e){return G(this,null,function*(){let t=new Image;return t.src=yield this.base64(e),t})}base64(e){return G(this,null,function*(){e=this._normalizeOptions(e,tt.defaultImageOptions);let{format:t,quality:r}=e,i=this.canvas(e);if(i.toBlob!==void 0)return new Promise((n,o)=>{i.toBlob(l=>{if(!l){o(new Error("ICanvas.toBlob failed!"));return}let a=new FileReader;a.onload=()=>n(a.result),a.onerror=o,a.readAsDataURL(l)},we[t],r)});if(i.toDataURL!==void 0)return i.toDataURL(we[t],r);if(i.convertToBlob!==void 0){let n=yield i.convertToBlob({type:we[t],quality:r});return new Promise((o,l)=>{let a=new FileReader;a.onload=()=>o(a.result),a.onerror=l,a.readAsDataURL(n)})}throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")})}canvas(e){e=this._normalizeOptions(e);let t=e.target,r=this._renderer;if(t instanceof p)return r.texture.generateCanvas(t);let i=r.textureGenerator.generateTexture(e),n=r.texture.generateCanvas(i);return i.destroy(),n}pixels(e){e=this._normalizeOptions(e);let t=e.target,r=this._renderer,i=t instanceof p?t:r.textureGenerator.generateTexture(e),n=r.texture.getPixels(i);return t instanceof v&&i.destroy(),n}texture(e){return e=this._normalizeOptions(e),e.target instanceof p?e.target:this._renderer.textureGenerator.generateTexture(e)}download(e){e=this._normalizeOptions(e);let t=this.canvas(e),r=document.createElement("a");r.download=e.filename??"image.png",r.href=t.toDataURL("image/png"),document.body.appendChild(r),r.click(),document.body.removeChild(r)}log(e){let t=e.width??200;e=this._normalizeOptions(e);let r=this.canvas(e),i=r.toDataURL();console.log(`[Pixi Texture] ${r.width}px ${r.height}px`);let n=["font-size: 1px;",`padding: ${t}px 300px;`,`background: url(${i}) no-repeat;`,"background-size: contain;"].join(" ");console.log("%c ",n)}destroy(){this._renderer=null}};Se.extension={type:[u.WebGLSystem,u.WebGPUSystem],name:"extract"};Se.defaultImageOptions={format:"png",quality:1};var rt=Se;var fe=class extends p{static create(e){return new p({source:new b(e)})}resize(e,t,r){return this.source.resize(e,t,r),this}};var Ct=new k,wt=new re,St=[0,0,0,0],j=class{constructor(e){this._renderer=e}generateTexture(e){e instanceof v&&(e={target:e,frame:void 0,textureSourceOptions:{},resolution:void 0});let t=e.resolution||this._renderer.resolution,r=e.antialias||this._renderer.view.antialias,i=e.target,n=e.clearColor;n?n=Array.isArray(n)&&n.length===4?n:_.shared.setValue(n).toArray():n=St;let o=e.frame?.copyTo(Ct)||Ue(i,wt).rectangle;o.width=Math.max(o.width,1/t)|0,o.height=Math.max(o.height,1/t)|0;let l=fe.create(C(d({},e.textureSourceOptions),{width:o.width,height:o.height,resolution:t,antialias:r})),a=x.shared.translate(-o.x,-o.y);return this._renderer.render({container:i,transform:a,target:l,clearColor:n}),l}destroy(){this._renderer=null}};j.extension={type:[u.WebGLSystem,u.WebGPUSystem],name:"textureGenerator"};var N=class{constructor(e){this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=e}reset(){this._stackIndex=0;for(let e=0;e<this._activeUniforms.length;e++)this._uniformsPool.push(this._activeUniforms[e]);for(let e=0;e<this._activeBindGroups.length;e++)this._bindGroupPool.push(this._activeBindGroups[e]);this._activeUniforms.length=0,this._activeBindGroups.length=0}start(e){this.reset(),this.push(e)}bind({size:e,projectionMatrix:t,worldTransformMatrix:r,worldColor:i,offset:n}){let o=this._renderer.renderTarget.renderTarget,l=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{projectionData:o,worldTransformMatrix:new x,worldColor:4294967295,offset:new Ge},a={projectionMatrix:t||this._renderer.renderTarget.projectionMatrix,resolution:e||o.size,worldTransformMatrix:r||l.worldTransformMatrix,worldColor:i||l.worldColor,offset:n||l.offset,bindGroup:null},c=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(c);let h=c.uniforms;h.uProjectionMatrix=a.projectionMatrix,h.uResolution=a.resolution,h.uWorldTransformMatrix.copyFrom(a.worldTransformMatrix),h.uWorldTransformMatrix.tx-=a.offset.x,h.uWorldTransformMatrix.ty-=a.offset.y,Le(a.worldColor,h.uWorldColorAlpha,0),c.update();let f;this._renderer.renderPipes.uniformBatch?f=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(c,!1):(f=this._bindGroupPool.pop()||new He,this._activeBindGroups.push(f),f.setResource(c,0)),a.bindGroup=f,this._currentGlobalUniformData=a}push(e){this.bind(e),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}pop(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===ue.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}get bindGroup(){return this._currentGlobalUniformData.bindGroup}get uniformGroup(){return this._currentGlobalUniformData.bindGroup.resources[0]}_createUniforms(){return new oe({uProjectionMatrix:{value:new x,type:"mat3x3<f32>"},uWorldTransformMatrix:{value:new x,type:"mat3x3<f32>"},uWorldColorAlpha:{value:new Float32Array(4),type:"vec4<f32>"},uResolution:{value:[0,0],type:"vec2<f32>"}},{isStatic:!0})}destroy(){this._renderer=null}};N.extension={type:[u.WebGLSystem,u.WebGPUSystem,u.CanvasSystem],name:"globalUniforms"};var st=!1,it="8.0.4";function nt(s){if(!st){if(ie.get().getNavigator().userAgent.toLowerCase().indexOf("chrome")>-1){let e=[`%c  %c  %c  %c  %c PixiJS %c v${it} (${s}) http://www.pixijs.com/

`,"background: #E72264; padding:5px 0;","background: #6CA2EA; padding:5px 0;","background: #B5D33D; padding:5px 0;","background: #FED23F; padding:5px 0;","color: #FFFFFF; background: #E72264; padding:5px 0;","color: #E72264; background: #FFFFFF; padding:5px 0;"];globalThis.console.log(...e)}else globalThis.console&&globalThis.console.log(`PixiJS ${it} - ${s} - http://www.pixijs.com/`);st=!0}}var P=class{constructor(e){this._renderer=e}init(e){if(e.hello){let t=this._renderer.name;this._renderer.type===ue.WEBGL&&(t+=` ${this._renderer.context.webGLVersion}`),nt(t)}}};P.extension={type:[u.WebGLSystem,u.WebGPUSystem,u.CanvasSystem],name:"hello",priority:-2};P.defaultOptions={hello:!1};var Me=class ot{constructor(e){this._renderer=e,this.count=0,this.checkCount=0}init(e){e=d(d({},ot.defaultOptions),e),this.checkCountMax=e.textureGCCheckCountMax,this.maxIdle=e.textureGCAMaxIdle,this.active=e.textureGCActive}postrender(){this._renderer.renderingToScreen&&(this.count++,this.active&&(this.checkCount++,this.checkCount>this.checkCountMax&&(this.checkCount=0,this.run())))}run(){let e=this._renderer.texture.managedTextures;for(let t=0;t<e.length;t++){let r=e[t];r.autoGarbageCollect&&r.resource&&r._touched>-1&&this.count-r._touched>this.maxIdle&&(r._touched=-1,r.unload())}}destroy(){this._renderer=null}};Me.extension={type:[u.WebGLSystem,u.WebGPUSystem],name:"textureGC"};Me.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:60*60,textureGCCheckCountMax:600};var Pe=Me;X.add(Pe);var Mt=(()=>{let s=class at{constructor(t={}){if(this.uid=w("renderTarget"),this.colorTextures=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),t=d(d({},at.defaultOptions),t),this.stencil=t.stencil,this.depth=t.depth,this.isRoot=t.isRoot,typeof t.colorTextures=="number")for(let r=0;r<t.colorTextures;r++)this.colorTextures.push(new b({width:t.width,height:t.height,resolution:t.resolution,antialias:t.antialias}));else{this.colorTextures=[...t.colorTextures.map(i=>i.source)];let r=this.colorTexture.source;this.resize(r.width,r.height,r._resolution)}this.colorTexture.source.on("resize",this.onSourceResize,this),(t.depthStencilTexture||this.stencil)&&(t.depthStencilTexture instanceof p||t.depthStencilTexture instanceof b?this.depthStencilTexture=t.depthStencilTexture.source:this.ensureDepthStencilTexture())}get size(){let t=this._size;return t[0]=this.pixelWidth,t[1]=this.pixelHeight,t}get width(){return this.colorTexture.source.width}get height(){return this.colorTexture.source.height}get pixelWidth(){return this.colorTexture.source.pixelWidth}get pixelHeight(){return this.colorTexture.source.pixelHeight}get resolution(){return this.colorTexture.source._resolution}get colorTexture(){return this.colorTextures[0]}onSourceResize(t){this.resize(t.width,t.height,t._resolution,!0)}ensureDepthStencilTexture(){this.depthStencilTexture||(this.depthStencilTexture=new b({width:this.width,height:this.height,resolution:this.resolution,format:"depth24plus-stencil8",autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1}))}resize(t,r,i=this.resolution,n=!1){this.dirtyId++,this.colorTextures.forEach((o,l)=>{n&&l===0||o.source.resize(t,r,i)}),this.depthStencilTexture&&this.depthStencilTexture.source.resize(t,r,i)}destroy(){this.colorTexture.source.off("resize",this.onSourceResize,this),this.depthStencilTexture&&(this.depthStencilTexture.destroy(),delete this.depthStencilTexture)}};return s.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1},s})(),$=Mt;var q=new Map;function pe(s,e){if(!q.has(s)){let t=new p({source:new B(d({resource:s},e))}),r=()=>{q.get(s)===t&&q.delete(s)};t.once("destroy",r),t.source.once("destroy",r),q.set(s,t)}return q.get(s)}var Re=class lt{get resolution(){return this.texture.source._resolution}set resolution(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}init(e){e=d(d({},lt.defaultOptions),e),e.view&&(ee(Z,"ViewSystem.view has been renamed to ViewSystem.canvas"),e.canvas=e.view),this.screen=new k(0,0,e.width,e.height),this.canvas=e.canvas||ie.get().createCanvas(),this.antialias=!!e.antialias,this.texture=pe(this.canvas,e),this.renderTarget=new $({colorTextures:[this.texture],depth:!!e.depth,isRoot:!0}),this.texture.source.transparent=e.backgroundAlpha<1,this.multiView=!!e.multiView,this.autoDensity&&(this.canvas.style.width=`${this.texture.width}px`,this.canvas.style.height=`${this.texture.height}px`),this.resolution=e.resolution}resize(e,t,r){this.texture.source.resize(e,t,r),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height,this.autoDensity&&(this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`)}destroy(e=!1){(typeof e=="boolean"?e:!!e?.removeView)&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}};Re.extension={type:[u.WebGLSystem,u.WebGPUSystem,u.CanvasSystem],name:"view",priority:0};Re.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};var ut=Re;var wi=[et,N,P,ut,I,Pe,j,rt],Si=[V,F,D,A,H,L,z,O];var Pi={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;

         
        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},Ri={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;

         
        `,main:`
            outColor = texture(uTexture, vUV);
        `}};var dt=class{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!de())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){let t=this.getUniformGroupData(e);e.buffer||(e.buffer=new me({data:new Float32Array(t.layout.size/4),usage:U.UNIFORM|U.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){let t=e._signature,r=this._syncFunctionHash[t];if(!r){let i=Object.keys(e.uniformStructures).map(l=>e.uniformStructures[l]),n=this._adaptor.createUboElements(i),o=this._generateUboSync(n.uboElements);r=this._syncFunctionHash[t]={layout:n,syncFunction:o}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,r){let i=this.getUniformGroupData(e);return e.buffer||(e.buffer=new me({data:new Float32Array(i.layout.size/4),usage:U.UNIFORM|U.COPY_DST})),t||(t=e.buffer.data),r||(r=0),i.syncFunction(e.uniforms,t,r),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;let t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}};var ct=class extends Q{constructor({buffer:e,offset:t,size:r}){super(),this.uid=w("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=w("resource"),this._bufferResource=!0,this.buffer=e,this.offset=t|0,this.size=r,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=w("resource"),this.emit("change",this)}destroy(e=!1){e&&this.buffer.destroy(),this.buffer=null}};function zi(s,e){for(let t in s.attributes){let r=s.attributes[t],i=e[t];i?(r.location??(r.location=i.location),r.format??(r.format=i.format),r.offset??(r.offset=i.offset),r.instance??(r.instance=i.instance)):se(`Attribute ${t} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}Pt(s)}function Pt(s){let{buffers:e,attributes:t}=s,r={},i={};for(let n in e){let o=e[n];r[o.uid]=0,i[o.uid]=0}for(let n in t){let o=t[n];r[o.buffer.uid]+=ve(o.format).stride}for(let n in t){let o=t[n];o.stride??(o.stride=r[o.buffer.uid]),o.start??(o.start=i[o.buffer.uid]),i[o.buffer.uid]+=ve(o.format).stride}}var K=[];K[g.NONE]=void 0;K[g.DISABLED]={stencilWriteMask:0,stencilReadMask:0};K[g.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};K[g.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};K[g.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};function ht(s,e,t,r,i,n){let o=n?1:-1;return s.identity(),s.a=1/r*2,s.d=o*(1/i*2),s.tx=-1-e*s.a,s.ty=-o-t*s.d,s}function ft(s){let e=s.colorTexture.source.resource;return globalThis.HTMLCanvasElement&&e instanceof HTMLCanvasElement&&document.body.contains(e)}var pt=class{constructor(e){this.rootViewPort=new k,this.viewport=new k,this.onRenderTargetChange=new S("onRenderTargetChange"),this.projectionMatrix=new x,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._renderer=e}finishRenderPass(){this.adaptor.finishRenderPass(this.renderTarget)}renderStart({target:e,clear:t,clearColor:r,frame:i}){this._renderTargetStack.length=0,this.push(e,t,r,i),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=ft(this.rootRenderTarget)}bind(e,t=!0,r,i){let n=this.getRenderTarget(e),o=this.renderTarget!==n;this.renderTarget=n,this.renderSurface=e;let l=this.getGpuRenderTarget(n);(n.pixelWidth!==l.width||n.pixelHeight!==l.height)&&(this.adaptor.resizeGpuRenderTarget(n),l.width=n.pixelWidth,l.height=n.pixelHeight);let a=n.colorTexture,c=this.viewport,h=a.pixelWidth,f=a.pixelHeight;if(!i&&e instanceof p&&(i=e.frame),i){let m=a._resolution;c.x=i.x*m+.5|0,c.y=i.y*m+.5|0,c.width=i.width*m+.5|0,c.height=i.height*m+.5|0}else c.x=0,c.y=0,c.width=h,c.height=f;return ht(this.projectionMatrix,0,0,c.width/a.resolution,c.height/a.resolution,!n.isRoot),this.adaptor.startRenderPass(n,t,r,c),o&&this.onRenderTargetChange.emit(n),n}clear(e,t=T.ALL,r){t&&(e&&(e=this.getRenderTarget(e)),this.adaptor.clear(e||this.renderTarget,t,r,this.viewport))}contextChange(){this._gpuRenderTargetHash=Object.create(null)}push(e,t=T.ALL,r,i){let n=this.bind(e,t,r,i);return this._renderTargetStack.push({renderTarget:n,frame:i}),n}pop(){this._renderTargetStack.pop();let e=this._renderTargetStack[this._renderTargetStack.length-1];this.bind(e.renderTarget,!1,null,e.frame)}getRenderTarget(e){return e.isTexture&&(e=e.source),this._renderSurfaceToRenderTargetHash.get(e)??this._initRenderTarget(e)}copyToTexture(e,t,r,i,n){r.x<0&&(i.width+=r.x,n.x-=r.x,r.x=0),r.y<0&&(i.height+=r.y,n.y-=r.y,r.y=0);let{pixelWidth:o,pixelHeight:l}=e;return i.width=Math.min(i.width,o-r.x),i.height=Math.min(i.height,l-r.y),this.adaptor.copyToTexture(e,t,r,i,n)}ensureDepthStencil(){this.renderTarget.stencil||(this.renderTarget.stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport))}destroy(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach((e,t)=>{e!==t&&e.destroy()}),this._renderSurfaceToRenderTargetHash.clear(),this._gpuRenderTargetHash=Object.create(null)}_initRenderTarget(e){let t=null;return B.test(e)&&(e=pe(e)),e instanceof $?t=e:e instanceof b&&(t=new $({colorTextures:[e]}),B.test(e.source.resource)&&(t.isRoot=!0),e.on("destroy",()=>{t.destroy()})),this._renderSurfaceToRenderTargetHash.set(e,t),t}getGpuRenderTarget(e){return this._gpuRenderTargetHash[e.uid]||(this._gpuRenderTargetHash[e.uid]=this.adaptor.initGpuRenderTarget(e))}};var Y=[{type:"mat3x3<f32>",test:s=>s.value.a!==void 0,ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:` 
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:s=>s.type==="vec4<f32>"&&s.size===1&&s.value.width!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:s=>s.type==="vec2<f32>"&&s.size===1&&s.value.x!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:s=>s.type==="vec4<f32>"&&s.size===1&&s.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:s=>s.type==="vec3<f32>"&&s.size===1&&s.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function an(s,e,t,r){let i=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `],n=0;for(let l=0;l<s.length;l++){let a=s[l],c=a.data.name,h=!1,f=0;for(let m=0;m<Y.length;m++)if(Y[m].test(a.data)){f=a.offset/4,i.push(`name = "${c}";`,`offset += ${f-n};`,Y[m][e]||Y[m].ubo),h=!0;break}if(!h)if(a.data.size>1)f=a.offset/4,i.push(t(a,f-n));else{let m=r[a.data.type];f=a.offset/4,i.push(`
                    v = uv.${c};
                    offset += ${f-n};
                    ${m};
                `)}n=f}let o=i.join(`
`);return new Function("uv","data","offset",o)}function R(s,e){return`
        for (let i = 0; i < ${s*e}; i++) {
            data[offset + (((i / ${s})|0) * 4) + (i % ${s})] = v[i];
        }
    `}var Rt={f32:`
        data[offset] = v;`,i32:`
        data[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":R(3,2),"mat4x2<f32>":R(4,2),"mat2x3<f32>":R(2,3),"mat4x3<f32>":R(4,3),"mat2x4<f32>":R(2,4),"mat3x4<f32>":R(3,4)},un=C(d({},Rt),{"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `});export{T as a,Lt as b,Pi as c,Ri as d,wi as e,Si as f,dt as g,Y as h,an as i,Rt as j,un as k,ct as l,zi as m,K as n,pt as o};
