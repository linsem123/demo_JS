### React 特性

虚拟 DOM  
声明式  
基于组件  
支持服务器端渲染

### React API

React.createElement(元素名-标签名,标签属性,元素内容)  
 创建 React 元素，React 元素创建无法修改，创建新的替换，修改 React 元素后必须重新渲染
ReactDOM.createRoot  
 创建 react 根元素
render 渲染元素的方法  
 首次调用，根元素所有 DOM 元素都会被 React 元素替换  
 再次调用 render 时 React 会使用差分算法比较两次渲染的元素，只在真实 DOM 更新变化的部分

声明式编程：结果导向的编程，通过 JSX 创建 React 元素，JSX 是 React 声明式编程的体现,  
通过 JSX babel 将类似 html 的书写方式，转换成 JS

### 虚拟 DOM

通过虚拟 DOM 将 React 元素映射成真实 DOM，这些操作最后都会在真实 DOM 体现  
直接操作 DOM：操作 DOM API 过多，降低操作 DOM API 复杂度；兼容性问题
虚拟 DOM：性能更好

数组数据  
重新渲染页面时，React 会按照顺序依次比较  
不设置 key，如果只是插入元素改变元素位置，所有位置发生改变的元素都会重新渲染  
key 作为当前列表的唯一标识，设置 key 后，再比较元素时，会比较相同 key 的元素，而不是按照顺序比较  
ps：避免用元素索引作为 key，索引是会改变的，如果元素顺序不会发生变化可以用

### React 项目

文件结构
public：不打包的静态文件
src：  
 index.js js 的入口文件

手动创建：
npm i react react-dom react-script
react 脚手架 create-react-app

package.json

### 组件

- 函数式组件  
  function 声明，函数名总是以大写字母开头  
  函数返回值为 JSX  
  return 关键字后如果有多行代码，需要用()包裹，没有括号包裹的话，任何在 return 下一行的代码都 将被忽略！
- 类组件 Class 声明  
   相较于 function 麻烦一点，能实现的功能相同，写法不同  
   继承 React.Component  
   类组件中必须添加一个 render 方法，方法返回值为 JSX

### JSX

标签扩展的 javascript

- 必须有且只有一个根元素
- 标签必须闭合，自结束标签必须有/
- html 标签小写，React 组件大驼峰
- {}嵌入表达式（有值的），布尔值、空值、undefined 不显示，会自动将数组中的元素渲染，对象则会报错
- style 使用对象设置 eg:style={{backgrondColor:'red'}}

### React.Fragment

专门用来作为父容器的组件，且不会在页面中生成 DOM
简洁写法<></>

### Props

父组件通过设置子组件属性向子组件传递数据  
子组件函数参数接收，参数 props 是对象  
子组件不可修改 props

- 可以使用 <Avatar {...props} /> JSX 展开语法转发所有 props，但不要过度使用它！
- props.children 获得父组件写在子组件标签之间的内容（类似 vue 的 slot）
- props.className 父组件写在子组件标签内的 className

### 条件运算

注：切勿将数字放在 && 左侧， && 表达式 的左侧为 true 时，它则返回其右侧的值。但条件的结果是 false，则整个表达式会变成 false。在 JSX 里，React 会将 false 视为一个“空值”，就像 null 或者 undefined，这样 React 就不会在这里进行任何渲染，但如果是数字在左侧如果为 0 会判断为 falsy 直接发返回左侧值即 0

### 事件

event 事件对象，需在函数中定义参数接收事件对象，但不是原生的事件对象，是 React 包装过的，故不存在兼容问题

- 取消默认事件 event.preventDefault()
- 阻止事件冒泡 event.stopPropagation()

### useState

组件渲染完毕后，直接修改组件中的变量，页面不会重新渲染
state 变量【改变】后会重新渲染页面，组件的函数体就会重新执行
useState 钩子函数创建 state，该函数返回一个数组

- 数组中第一个元素是初始值
- 第二个元素是函数，该函数修改 state，并重新渲染组件
- 当 state 值是对象时修改时是用新对应替换旧对象
- 修改的是组件下一次渲染的 state 值
- setState 是异步的，调用后不会立刻重新渲染页面  
  --有可能出现计算错误，避免这种情况可以用传递回调函数的方式修改 state，回调函数执行时，会将最新的 state 作为参数传递，可以获取最新的值

setState 执行流程  
 1.dispatchSetState 判断组件处于什么阶段  
 渲染阶段：不会判断 state 值是否相同
非渲染阶段：会检查 state 值是否相同  
 如果值不相同，会对组件重新渲染，  
 如果值相同，则不会对组件重新渲染
--但是在值相同的一些情况下，还是会继续执行当前组件的渲染，但不会触发子组件的渲染，这次渲染不会产生实际的效果  
--通常是值第一次相同的情况，

### React.StrctMode

React 严格模式，会检查产生副作用的代码
‘double-invoking’开发模式下会重复调用一些函数，以使副作用显现

### useEffect

是专门处理‘副作用’代码的钩子函数，专门处理不能直接写在函数体里的代码  
useEffect 会在组件渲染完毕后执行

```
//useEffect 第二个参数是可选的
//第二个参数是数组，在数组中指定依赖项，依赖项发生改变才会触发useEffect执行，如果依赖项是个空数组，useEffect只会在组件初始化时触发
useEffect(()=>{},[value1，value2])
```

- 什么是“副作用”
  不能直接写在函数体里的代码，可能会影响组件渲染
  可能产生副作用的代码
  useState() useReducer() useMemo()
- 清理函数  
   useEffect 回调函数中，指定一个函数为返回值，它会在 Effect 执行前调用，可以在这个函数中清理上一次 Effect 执行带来的影响

  ```
  useEffect(()=>{
    console.log(2)
    return ()=>{
      console.log(1)
    }
  },[value])
  //执行顺序
  //2,1
  ```

  应用场景

  ```
  //搜索查询
  useEffect(()=>{
    const timer = setTimeout(()=>{
      request(keyword)//发送请求
    },1000)
    return ()=>{
     clearTimeout(timer)
    }
  },[keyword])

  ```

  ？？？

- 在 React 中，副作用指的是与组件渲染结果无关的任何操作，例如：
  发送网络请求
  修改 DOM 元素
  访问本地存储
  订阅或取消订阅事件
  改变组件状态外的变量等
  这些操作会影响组件的行为和状态，但是并不会直接影响渲染结果。在 React 中，应该将副作用分离出来，以便更好地控制组件的行为和状态。

  通常，React 使用钩子函数（如 useEffect）来处理副作用。在 useEffect 中，可以执行一些副作用操作，例如发送网络请求或订阅事件，以及在组件卸载时清除这些操作。这可以保持组件的一致性和可维护性。

### ref

useRef 钩子函数

- 返回的是一个普通的 js 对象{current:xxx}，但 useRef 确保每次渲染获取到的都是同一个对象

### 类组件

- 类组件的 props 是储存在类的实例中，可以通过 this.props 访问

* state
  通过 this.state 访问 state，this.setState() 修改 state
  通过 this.setState() 修改 state，React 会 将修改的属性与之前的属性合并 ，之前的属性都会保留，仅限于直接储存于 state 中的一级属性
  this.setState()响应函数是以类的方法来定义

- render 函数中 JSX 访问类的方法及属性需要 this.xxx

* 获取 DOM
  React.creatRef()，返回对象{current:xxx}

  类组件中自定义方法用箭头函数，避免 this 指向问题

### 表单

state 设置为表单 value，表单变化 state 随之变化，state 变化表单项也变化，这种操作成为双向绑定，表单成为受控组件

### hooks

函数组件解决没有 state，生命周期，逻辑不能复用的一种技术方案

1. 函数组件没有 state？

- 钩子函数只能在函数组件或者自定义钩子里使用
- 钩子函数只能直接在函数组件里调用，不可以在函数组件里嵌套的函数中调用
  自定义钩子函数，名字 useXxx

### portal

将组件渲染到页面指定位置
方法：  
 1.在 index.html 添加一个元素，作为渲染组件的容器  
 2.修改组件的渲染方式，改为 return ReactDom.createPortal(React 元素，根 DOM)  
 根 DOM 是在 index.html 添加的 DOM 节点

### 样式

直接引入的 css 文件样式是全局的  
CSS_Model css 文件名 xxx.model.css，引入时 import classes from ‘xxx.model.css’  
ClassName={classes.类名}

### 移动端适配

设置 body 的 fontSize=100/750+'vw'
视口宽度即 750rem

### Context

组件层级过多，父组件与孙组件数据传递，需要一层一层传递  
 Context：不同组件之间共同享数据的方式  
 Context 相当于一个公共的存储空间，所有组件都可以访问

```
//创建Context，并导出模块
//const [变量名] = Reaact.ctreateContext(公共数据/公共方法)
//export default 变量名
const Ctx = Reaact.ctreateContext({name:'nick'})
export default Ctx
```

```
//使用Contex方式一
//导入模块
import Ctx from xxx
const test = ()=>{
return(
  <Ctx.Consumer>
    {(ctx)=>{
      <span>{ctx.name}</span>
    }}
  </Ctx.Consumer>
)
}
```

```
//使用Contex方式二，用钩子函数
const ctx = useContext(Ctx)
```

Ctx.Provider  
 表示数据的生产者， 可以用来指定 Context 中的数据，这样一来创建 Context 的时候可以不生成数据，而是在 Provider 的 value 属性来指定 Context 的数据,  
 这样一来该组件的子孙组件都可以访问其生成的 Context 数据  
 默认读取最近的 Context 数据，如没有 Provider 则读取 Context 默认数据
如果需要 Context 数据是响应式的，需要将 state 数据生成为 Context 数据

```
const [name,setName]=useState('nick')
return(
  <Ctx.Provider value={{name:name}}>
    {children}
  </Ctx.Provider>
)
```

### useRecucer

整合 state

```
//useReducer(reducer,initialArg,init)
//reducer:函数，renducer返回值即为state的新值
//initialArg：state初始值，和useState()的一样

//useReducer返回值，为一个数组
//第一个参数：用来获取state的值
//第二个参数：state修改的派发器
//通过派发器发送操作state的命令，具体的修改行为由reducer函数执行


const [date,dateDispatch] = useReducer((state,action))=>{
  if(action.type =='ADD'){
    //可以根据action.type来执行不同的操作
    return state+1
  }
  return state
},1 )
dateDispatch({type:'ADD'})


//为了避免reducer重复创建，通常reducer会定义到组件函数外部
const reducer = (state,action))=>{
  if(action.type =='ADD'){
    //可以根据action.type来执行不同的操作
    return state+1
  }
  return state
}
funtion App(){
  const [date,dateDispatch] = useReducer(reducer,1)
}
```

### React.Memo

父组件重新渲染，子组件也会重新渲染，避免这种情况
React.Memo 是一个高阶函数，接受组件为参数，返回包装过的新函数，
包装过的组件有缓存功能，包装过后只有组件的 props 改变才会触发组件的重新渲染

如果是子组件通过 pprops 传递的方法修改父组件的 state，父组件函数重新渲染，传入子组件的方法也会重新创建，即使通过 React.Memo 包裹子组件，子组件也会重新渲染，此时可以用 useCallback 来解决，这样父组件函数重新渲染的时候不会重新创建方法

### useCallback

用来创建 React 的回调函数

不会总在函数重新渲染时重新创建

```
//Button文件
function Button(props){

  return <button onClick="props.addHandle">add</button>
}
export default React.Memo(Button)


//App文件
finction Add () {
  const [count,setCount] = useState(0)
  //useCallback有两个参数
  //参数一：回调函数
  //参数二：依赖数组
//如果不指定依赖数组，每次重新渲染回调函数都会重新创建
//依赖数组为空，只创建一次
//依赖数组变量变化，回调函数才会重新创建，因此所有依赖的变量都要放进去
  cosnt addHandle = useCallback(()=>{
    setCount(prevState=>prevState+1)
  })
  return (
    <div>
      <div>{count}<div>
      <Button addHandle={addHandle}/>

    </div>
 )
}
```

### Redux

Redux 是为 JS 提供的可预期的状态容器
问题：  
1.当 state 比较复杂的时候不好维护 --redux 可以拆分 reducer  
2.每次返回新的 state，都需要先复制一遍 state
3.action.type 常量不好维护

RTK：简化 Redux 操作 npm install @reduxjs/toolkit
安装 RTK 可以不用再安装 Redux 的核心包  
createSlice 创建 reducer 切片，可以自动生成 action ，需要一个配置对象作为参数
configureStore 创建 store 对象，需要一个配置对象作为参数

```
const student = createSlice({
  name:'stu',//生成action.type
  initialState:{
    name:'nick',
    age:18
  },//初始化数据
  reducers:{
  setName(state,action)
  //state代理对象，可以直接修改
  state.name = '大笨蛋'
  },//指定State操作直接在对象中添加方法
  setAge(state,action){

  }
})
//actions中储存的slice自动生成的action创建器（函数），调用后会自动创建action
export const {setName,setAge} = student.actions
constole.log(setName('11'))//{type:'stu/setName',payload:'11'}
const store = configureStore({
  reducer:{
    student:student.reducer
  }
})
```

useSelector()加载 state 数据

```
const state = useSelector(state=>state)

```

useDispatch()获取派发器对象，修改 state

```
import {setName} from xxx
const dispath = useDispatch()
dispath(setName())

```

RTK Query :RTKQ
数据获取和缓存工具  
1.根据不同的加载状态显示不同的组件  
2.减少相同数据重复发送请求  
3.在用户与 UI 交互时，管理缓存的生命周期

creatApi

### 其他

strapi 可以模拟 API

### 问题

react 兼容哪些浏览器及版本
MDN
