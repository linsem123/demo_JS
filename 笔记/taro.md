一、入口组件

入口组件写在 src/app.js
全剧配置文件 src/app.config.js，我们可以在全局配置文件中设置页面组件的路径、全局窗口、路由等信息
页面组件 src/pages
页面组件（例如 index.vue）也会有一个页面配置（例如 index.config.js）

### Taro 的生命周期

- onLoad
  在此生命周期中通过访问 options 参数或调用 getCurrentInstance().router，可以访问到页面路由参数。
  - onUnload
  * onReady ()
    从此生命周期开始可以使用 createCanvasContext 或 createSelectorQuery 等 API 访问小程序渲染层的 DOM 节点

组件生命周期

- onshow
  页面隐藏/切入后台时触发  
  对应 react componentDidShow

* onHide
  页面显示/切入前台时触发
  对应 react componentDidHide

### 性能提升

- 跳转页面预加载
  从调用 Taro.navigateTo 等路由跳转 API 后，到小程序页面触发 onLoad 会有一定延时，因此一些网络请求可以提前到发起跳转的前一刻去请求。
  Taro 3 提供了 Taro.preload API，可以把需要预加载的内容作为参数传入，然后在新页面加载后通过 Taro.getCurrentInstance().preloadData 获取到预加载的内容。

* 优化长列表性能
  VirtualList 组件:它只会渲染当前可视区域内的组件，非可视区域的组件将会在用户滚动到可视区域内后再渲染，从而减少实际渲染的组件、优化渲染性能。
* 基础组件的属性要保持引用

假设基础组件（如 View、Input 等）的属性值为非基本类型时，尽量保持对象的引用。

```
<Map
  latitude={22.53332}
  longitude={113.93041}
  markers={[
    {
      latitude: 22.53332,
      longitude: 113.93041,
    },
  ]}
/>

<Map latitude={22.53332} longitude={113.93041} markers={this.state.markers} />
```

基础组件（如 View、Input 等）如若设置了非标准的属性，目前这些额外属性会被一并进行 setData，而实际上小程序并不会理会这些属性，所以 setData 的这部分数据是冗余的。

- 预渲染 prerender
