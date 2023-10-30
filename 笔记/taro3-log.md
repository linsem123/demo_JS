## 2023/8/1

- 按照官网在 config/index.js 和 tsconfig.json 配置 alias，编译时会报错，此时需要在 config/index.js 添加 const path = require('path')

```
//config/index.js
const path = require('path')
const config = {
 alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
  },
}

```

```
//tsconfig.json
{
  "compilerOptions":{
    "paths": {
        "@/components/*": ["./src/components/*"],
        "@/utils/*": ["./src/utils/*"]
      }
    }
}
```

- 在文件中直接 import 'xxx.css'是全局样式，用 react 的 CSS Module 开启局部样式

## 2023/8/2

- 在 CSS Module 文件更改组件库 vant 的样式

```
//eg，会在全局生效
:global(.van-nav-bar){

}
```

- 问题：scss 在全局样式 app.scss 设置 scss 变量，在 CSS Module 样式文件访问不到
  在配置文件中加入该配置也无效

  ```
  const config = {
    ...
    sass: {
      resource: [path.resolve(__dirname, '..', 'src/app.scss')],
      data:"$color:'white'"
    },
  }

  ```

* 问题： 使用 CSS Module 设置样式 className={classes.name},name 不能是一个变量？

### 8/8

- 自定义 navbar 页面配置

```
export default definePageConfig(
{ navigationStyle: 'custom',//开启自定义navbar
  usingComponents: {
    MainNavBar: '../../components/MainNavBar'
  }
}
)
```

### 8/9

使用 vant NavBar
问题：wx 小程序 NavBar 会自适应不同机型，此时页面需要一个 padding，如何根据不同机型自适应  
8/14 解决：在 NavBar 外层包裹了一层 position:sticky

问题：如何根据不同机型 NavBar 增加的自适应 padding-top，给页面 bg-color 统一增加相应的高度

### 8/10

- taro-iconfont-cli
  wx 小程序 渲染出来的额 icon 宽高单位为 px 无法改动，不同屏幕尺寸 icon 大小不会自适应改变  
  原因：iconfont.cofig 的 use_rpx 设置为 true

  ```
  {
    "use_rpx": true,
  }
  ```

- @media 在 wx 小程序只执行最后一个

### 8/11

wx 里 new Date('xxxx-xx-xx')没效果，需要 new Date('xxxx/xx/xx')

taro 获取元素高度  
通过 ref 或者 document 获取元素高度，只适应于在 H5 页面，如果要同时兼容 wx 小程序和 H5 可以用 Taro.createSelectorQuery()

```
const query = Taro.createSelectorQuery()
    query
      .select('#brief')
      .boundingClientRect((rect) => {
        const height = rect.height
      })
      .exec()
```

注意 Taro.createSelectorQuery() 是异步的，如果是一个 list，获取每一个 item 的高度,并存放在数组内

```
//以下写法content会是空
const content = []
 data.festivalDetail.forEach((item, index) => {
      query
        .select('#content' + index)
        .boundingClientRect((rect) => {
          content.pus(rect.height)

        })
        .exec()
    })
     setContentMore(content)
     //content []


// 需改为一下写法
 data.festivalDetail.forEach((item, index) => {
      query
        .select('#content' + index)
        .boundingClientRect((rect) => {
          setContentMore((pre) => [...pre, rect.height])
        })
        .exec()
    })

```

### 8/12

- 编译优化

- tarp-iconfont-cli
  app.config.ts 文件一定要添加该配置信息，否则打的生产包会不显示 icon

```
// src/app.config.js
import { useGlobalIconFont } from './components/iconfont/helper';

export default {
  usingComponents: Object.assign(useGlobalIconFont()),
}

```

### 8/14

字体文件类型
oft-ttf 的进阶版
ttf-旧浏览器支持度较高
woff-网页所采用的字体格式标准 ,压缩版本，文件较小
woff2-与 woff 采用的压缩技术不一样，压缩效果更好，兼容较差

字体压缩方式
参考：https://zhuanlan.zhihu.com/p/577387539?utm_id=0

- 可以通过提取文字子集的方法
- 压缩为 woff 或 woff2

用到 Python 的一个库：fonttools，使用最新版 Python 的 pip 命令安装即可在 Shell 中使用：

```
 $ pip install fonttools
 //取子集
 $ fonttools subset "$input_file" --text-file="$text_file" --output-file="$output_file"
 //压缩
$ fonttools ttLib.woff2 compress "$input_file" -o "$output_file"

```

### 8/15

taro-react-echarts 支持小程序和 H5
用 echarts-taro3-react，只支持小程序

代码压缩

### 8/31

new Date().toLocalString('zh' ,{year:'numeric',month:'long',day:'numeric'})
MDN

### 9/18

vant 组件，H5 页面在本地环境单位是 rem，在 build 过后变成 px，导致页面样式错乱？
10/23 更新-->config/index.ts 增加配置
![Alt text](image-2.png)

### 9/27

Taro Canvas 组件

```
//通过createCanvasContext创建的canvas上下文对象，在H5端正常绘图，但是在wx小程序端无法绘图
let ctx = Taro.createCanvasContext('myCanvas')
//修改画布的方法， ctx.canvas只在h5页面能获取到
ctx.canvas.width = canvasWidth
ctx.canvas.height = canvasHeight
ctx.beginPath()
...
ctx.draw()

```

```
//wx 小程序端绘图，通过 createSelectorQuery 创建 canvas 实例
Taro.createSelectorQuery()
  .select('#myCanvas')
  .node((res) => {
    //wx 设置画布大小
    res.node.width = canvasWidth
    res.node.height = canvasHeight
    const wxCtx = res.node.getContext('2d')
    wxCtx.beginPath()
    ...
    wxCtx.draw()
  })
  .exec()

```

问题：在 wx 小程序，
外层元素设置 position:relative,transform:scale(0.5)
canvas 外包裹的 View 设置 position:absolute，
canvas 设置画布尺寸=包裹的 View 的宽高，
按照画布尺寸绘图，会放大一倍
所以绘图时候按照画布的一半尺寸绘图会导致模糊；
画布尺寸 \* 2

```
<!-- 结构 -->
<View style="position:relative;transform:scale(0.5)">
  <View style="position:absolute">
    <Canvas>
  </View>
</View>
```

### 10/27

微信 new Date()只支持 yyyy/MM/dd 格式，其他格式会报错
