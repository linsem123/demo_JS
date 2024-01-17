## let/const/var

新的变量声明方式 let/const

1.没有变量提升，必须先声明再使用，否则报错。  
2.块级作用域：let 声明的变量只在它所在的代码块有效  
3.相同作用域内，不能重复声明同一个变量
4.“暂时性死区”:如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

let:变量
const：常量（指向固定的一个地址）/对象/函数
一旦声明变量，就必须立即初始化，不能留到以后赋值。
一旦声明，常量的值就不能改变。但是如果是个对象可以改变对象的属性值。

声明变量的 6 种方法：var function let const import class

闭包：

## 解构赋值

1.“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。（数组，对象，字符串，数值，布尔值，函数参数）

```
const arr = [1,2]
const [a,b] = arr
const obj = {name:'nick',age:18}
const {name,age} = obj
const {name:c,age:d} = obj
console.log(a,b,c,d)//1 2 'nick' 18
const [e,f]='abc'
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

2.默认值，只有当其中一个成员等于 undefined，才会默认赋值。null 与 undefined 不严格相等。  
3.用途：变量赋值；交换变量的值；从函数返回多个值；函数参数的定义；提取 JSON 数据；函数参数的默认值；遍历 Map 结构；输入模块的指定方法

```
//交换变量的值
let a=10,b=20;
[a,b]=[b,a]
```

## 扩展运算符...

数组，字符串  
1.将一个数组转为用逗号分隔的参数序列。

```
[...[1,2,3]] //[1, 2, 3]
```

3.代替 apply 方法，将数组转为函数的参数。  
4.复制数组（改变克隆的数组不会影响原数组）  
5.合并数组  
6.与解构赋值结合  
7.字符串扩展成数组
8.Map 和 Set 结构，Generator 函数，遍历器（interator）可以使用  
 9.扩展运算符（...）也可以将某些数据结构转为数组，比如 NodeList ，arguments 对象

```
//浅拷贝
const arr = [1,2,3]
const arr1 = [...arr]
arr[0]=5
console.log(arr,arr1)//[5,2,3] [1,2,3]
```

```
const arr = [1,2,3,[4]]
const arr1 = [...arr]
arr[3][0]=5
console.log(arr,arr1)//[1,2,3,[5]] [1,2,3,[5]]
```

## 箭头函数

函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。  
箭头函数没有自己的 this，如果你在箭头函数中使用了 this，那么该 this 一定就是外层的 this，也因为这样不能用作构造函数；  
不可以使用 arguments 对象，用 rest；不能用做 Generator 函数
无法使用 call，apply，bind 改变 this 指向

## Promise

是用于处理异步操作的对象

- 手写见 =>手写 promise
- Promise.all
  所有的都成功才成功，有一个失败就失败，传入的是数组，反回的也是数组
  相关面试问题：并发 promise
  all：所有的都成功才成功，有一个失败就失败，传入的是数组，反回的也是数组
- Promise.race：竞速 ，有一个成功或失败就返回，返回一个新的 Promise

  相关面试问题：对包裹的 promisr,随时 abort 掉

  ```js
  //通过闭包，和promise.race实现
  const wrap = promise => {
    let _reject;
    const obj = Promise.race([
      promise,
      new Promise((resolve, reject) => {
        _reject = reject;
      })
    ]);
    obj.abort = () => _reject('abort');
    return obj;
  };

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功了');
    }, 5000);
  });

  const a = wrap(promise);
  a.then(
    res => {
      console.log(res);
    },
    err => {
      console.log(err);
    }
  );
  setTimeout(() => {
    a.abort();
  }, 2000);
  ```

- Promise.allSettled：2020 新增，所有的都执行完才返回，返回一个新的 Promise
- Promise.any：只要有一个成功就成功，所有失败才失败，返回一个新的 Promise

其他：
控制并发数量

## async await

是用来处理异步操作的语法，使得异步操作按照顺序执行实现代码的同步操作，可以避免回调地狱。
async 函数 返回 Promise 对象
await 右侧通常是一个返回 Promise 的表达式

## 模块化

模块：将大的程序拆分成相互依赖的小文件，再用简单的方法拼装起来。
项目结构更清晰-解偶
提高复用
易维护

模块加载方案：commonJS，AMD
运行时加载，ES6 编译时就加载完成
import 输入
export 输出

一个模块只能有一个默认导出
export default
默认情况，script 标签中不能使用 import，需设置 type=module

ES6 模块自动采用严格模式
一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用 export 关键字输出该变量。
export 语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
输出的必须是一个接口，函数和类同理
import 载入的变量是只读的不能更改，如果是对象可以改写其属性
import 具有提升效果，会提升到整个模块的头部，因为是编译时就加载执行了
不能用表达式和变量
载入相同的模块多次，只执行一次
export default 匿名函数默认输出，其实就是输出一个叫做 default 的变量
import 的 name 可以是任意的

```

import {a} from xxx 导入命名
import a from xxx 导入匿名

```

## 类

类是对象的模版
类决定了对象中有哪些属性和方法
class 定义类

```

class Person{
//类中的代码在严格模式下执行
//严格模式-函数的 this 指向不是 window-
constructer(name){
//构造函数
//当通过 new 创建对象，实际上就是在调用类的 constructer
//name 是创建对象时传入的参数
//构造函数中通过 this 可饮用当前对象
this.name = name
}
fn(){
/_类中 this 指向是不固定的
_ 方法形式调用 this 指向当前实例
_ 函数调用 this 是 undefined
_ 想要 this 指向固定
_ 使用箭头函数
_/

    console.log(this)

}
}
const person = new Person('nick')
person.fn()// Person
const \_test = person.fn// Person
\_test() // undefined

```

类的继承

```

class Animal{
constructer(name){
this.name = name
}
hello = ()=>{
console.log('hello')
}
}

//继承父类的所有属性和方法
class Dog extends Animal{
//子类重写构造函数，需要在子类中执行父类的构造函数，否则报错
constructer(name){
super(name);//调用父类构造函数,调用时有参数需要传参
}
//子类创建同名的属性或方法会覆盖父类的
hello=()=>{
console.log('hello dog')
}
}

```

原型：
原型链 ：逐级向上查找

静态属性和静态方法：直接通过类调用的属性和方法

```

class Person{
static age = 18
static fn = () => {
console.log(this)//this 指向当前类
}
}
console.log(Person.age)
Person.fn()

```

## 数组方法

map 根据原数组的处理每一项元素返回一个新的数组，原数组不改变
filter 返回符合条件的新数组，原数组不改变
find 返回符合条件的第一项元素
reduce((prev,curr，currentIndex,array)=>prev+curr,[init]) 数组聚合，初始值-用来指定第一运算的 prev，如不指定从第二个元素开始运算

```

```
