### MVC mvp MVVM

软件架构设计模式（Architectural Pattern），通过分离关注点来改进代码的组织方式。
view
model
viewmodel -数据绑定，DOM 监听

## 选项式 API/组合式 API 区别 怎么选择

选项式 API：组件实例提供了一系列的选项如 methd，computed，watch 来实现组件的逻辑， this 指向当前组件实例，
组合式 API：

## 响应式原理 Proxy

## DOM 更新机制

不是数据改变 DOM 就同步更新，在【下一个更新周期】保证每个组件只更新一次
nextTick

## reactive

用于对象类型，如果通过解构或赋值给变量会失去响应性

### ref

用于值类型，在模版语法中自动解包

### 计算属性

返回值为计算属性 ref

### 指令

- v-if 和 v-for 不在同一个元素上使用
- v-if 优先于 v-for，v-if 访问不到 v-for 作用域内的变量
- key:1.【就地更新】策略；2.提高渲染效率？
- v-for in 和 of 在 vue 中是一样的效果

## 组件 props

自定义类或构造函数，通过 instanceof 检查类型？

## v-model

实现：
默认 prop 为 modelValue，emit 事件名为 update:modelValue
若自定义 prop 名，需在 v-model 也指定一个参数

修饰符：
trim、number、lazy

自定义修饰符：
通过 prop 访问 v-model 添加的修饰符
生成的 prop 名将是 arg + "Modifiers"

文本类 input textarea 绑定 value 属性 侦听 input 事件

checkbox 和 radio 类型 绑定 checked 属性 侦听 change 事件

select 绑定 value 侦听 change 事件

## 透传 Attribute

在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

## 插槽

无渲染组件：组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件

## 依赖注入 provide 和 inject

深层的子组件访问到父组件的数据

## vue3 新功能

1.组合式 API 2.单文件组件不需要有根节点 3.更新 DOM 的算法 4.创建应用 5.响应式原理

问题：
