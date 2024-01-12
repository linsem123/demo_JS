## 概念

JS 的超集，在 JS 的基础上增加了可选静态类型和基于类的面向对象编程。

## 应用

大型复杂项目，多人协作开发和代码维护复杂的场景

## 对比 JS

TS 在编译阶段就能发现大部分错误，增强了代码的健壮性  
JS 在运行时才能发现错误

TS 弱类型，有静态类型和动态类型检测
JS 强类型，只有动态类型检测

TS 依赖于编译，需要在打包时转为浏览器可识别的 JS
JS 不需要编译，直接在浏览器中运行

## 基础类型

- number string boolean array null undefined

- 元组

数组的一种，可以指定数组中每一项的类型和个数

```ts
let arr: [string, number] = ['1', 2];

arr.push(1); //增加越界的元素，会使用联合类型替代
```

- 枚举

一组有名字的常量集合

```ts
// 数字类型枚举，默认从0开始，依次递增
enum Color {
  Red,
  Green,
  Blue
}

let c: Color = Color.Green; // 1
//反向映射
Color[0]; // Red

//字符串类型枚举
enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}

//异构枚举
enum Color {
  Yellow, //0
  Pinck, //1
  Red = 'red',
  Green = 9,
  Blue //10
}

// 赋值相同,后面的会覆盖前面的

enum Color {
  Yellow, //0
  Pinck, //1
  Red = 1
}
Color[1]; //Red

//计算成员
enum Color {
  yellew = getYellow(),
  Pinck, //不被允许，计算成员后面的枚举成员必须有初始值
  Red = 'red'
}
//常量枚举
const enum Enum {
  A = 1,
  B = A * 2 //不允许出现计算成员，只能是常量
}
//外部枚举 用来描述已经存在的枚举类型的形状？？？
declare enum Enum {
  A = 1,
  B,
  C = 2
}
```

- any：任意类型，不进行类型检查
- unknown：未知类型，不进行类型检查，但是不能直接赋值给其他类型

  ```ts
  let a: unknown;
  a = 1;
  a = true;
  let b: unknown = a; //ok
  let c: string = a; //error
  let d: any = a; //ok
  ```

- void：空类型/无返回值，只能赋值为 undefined 和 null

  ```ts
  let a: void;
  a = undefined;
  a = null;
  let b: void = a; //ok
  let c: string = a; //error
  let d: any = a; //ok
  ```

- never：永远不会有返回值的类型，一般用于抛出异常或无限循环

  ```ts
  function fn(): never {
    throw new Error('error');
  }
  ```

- Object/object/{}
  Object：可以接受任何类型的值
  object：非原始类型，除了 number，string，boolean，symbol，null，undefined 之外的类型
  {}： 空对象类型，不能赋值为其他类型

## 类型断言

类型的声明权由开发者掌握，可以用来告诉编译器变量的实际类型

实现方式：1.尖括号语法；2.as 语法

```ts
let a: any = '1';
let b: number = (<string>a).length;
let c: number = (a as string).length;
```

应用场景：

```ts
//将联合类型断言为其中一个类型
let a: number | string = '1';
let b: number = (a as number).toFixed(2);

//any类型断言为确定类型
let a: any = 1;
let b: number = a as number;

//父类断言为更为具体的子类
```

注意： as any 不要滥用，会导致类型检查失效
面试问题：以下代码的运行结果

```ts
const a: number | undefined = undefined;
const b: number = a!;
console.log(b); //编译通过，因为赋值时非空断言
```

## 接口 interface

对类（class）进行抽象

```ts
interface Person {
  name?: string; //?: 可选属性
  readonly age: number; //readonly 只读属性
  say(): void;
  [propName: string]: any; //多个任意属性
}

let ro: ReadonlyArray<number> = [1, 2];
//只读属性既不可以修改值，也不可以修改长度，也不可以赋值给普通的数组，因为可能被修改
ro.length = 100; //error
let a: array[] = ro; //error
```

- 定义数组

  ```ts
  interface NumberArray {
    [index: number]: string; //index 任意名称，但一定是 number 类型
  }
  let fibonacci: NumberArray = ['1', '2'];
  ```

- 定义函数

  ```ts
  interface SearchFunc {
    (source: string, subString: string): boolean;
  }
  const func: SearchFunc = (source, subString) => {
    return source.includes(subString);
  };
  func('hello', 'll');
  ```

- 可索引的类型 - 定义对象的索引类型，可以是数字或者字符串
- 类类型 - implements

- 接口继承

可以继承一个或者多个接口  
接口可以继承类

```ts
interface Person {
  name: string;
  age: number;
}
interface Student extends Person {
  grade: number;
}
```

- 接口合并
  类合并与接口一致

```ts
//合并的属性类型必须是唯一的
interface Person {
  name: string;
}
interface Person {
  name: string; //必须与上面的一致，假如是number编译不通过
  age: number;
}
let p: Person = {
  name: 'nick',
  age: 18
};
```

- type 和 interface 的区别

1. interface 可以进行声明合并，同样名称的接口最后会自动合并；type 不可以
2. type 可以声明基本类型别名，联合类型，交叉类型，元组等类型；
   interface 声明的类型只能是函数或对象类型
3. interface 可以 extends 和 implements；type 不可以

- 交叉类型

  ```ts
  interface A {
    name: string;
  }
  interface B {
    age: number;
  }
  type C = A & B;
  let c: C = {
    name: 'nick',
    age: 18
  };
  ```

  面试问题： 合并冲突

## 类型守卫

表达式，检查变量的类型，变量可能是联合类型，通过类型守卫可以缩小变量的类型范围

- in 语法 通过属性确认类型

  ```ts
  interface A {
    name: string;
  }
  interface B {
    age: number;
  }
  function fn(val: A | B) {
    if ('name' in val) {
      console.log(val.name);
    } else {
      console.log(val.age);
    }
  }
  ```

- typeof 语法 利用属性值的类型确认类型

  ```ts
  function fn(val: string | number) {
    if (typeof val === 'string') {
      console.log(val.length);
    } else {
      console.log(val.toFixed(2));
    }
  }
  ```

  - instanceof 语法 利用构造函数确认类型

  ```ts
  class Person {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
  class Animal {
    age: number;
    constructor(age: number) {
      this.age = age;
    }
  }
  function fn(val: Person | Animal) {
    if (val instanceof Person) {
      console.log(val.name);
    } else {
      console.log(val.age);
    }
  }
  ```

## 类

```ts
class Greeter {
  greeting: string; //需要定义属性类型
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

let greeter = new Greeter('world');
```

- 类的继承
  ```ts
  class Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    getName() {
      return this.name;
    }
    setName(name: string) {
      this.name = name;
    }
  }
  class Dog extends Animal {
    age: number;
    constructor(name: string, age: number) {
      super(name); //调用父类构造函数
      this.age = age;
    }
    getName() {
      super.getName(); //调用父类方法，继承父类方法
    }
  }
  ```
- public private protected
  public：公共属性，可以在类的内部和外部访问
  private：私有属性，只能在类的内部访问
  protected：受保护的属性，只能在类的内部和子类中访问
  ```ts
  class Person {
    protected name: string;
    private age: number;
    constructor(name: strin, age: number) {
      this.name = name;
      this.age = age;
    }
  }
  class Child extends Person {
    constructor(name: string, age: number) {
      super(name, age);
    }
    getName() {
      console.log(this.name); //在子类内部可以访问
    }
    getAge() {
      console.log(this.age); //error 只可以在父类访问
    }
  }
  const c = new Child('nick', 18);
  c.name; //error
  c.getName(); //nick
  ```
- readonly 只读属性，不可以修改
- static 属于类的本身而不是类的实例，可以通过类直接访问，不需要实例化
- 存取器 get/set

控制对类的属性的访问，只设置 get 不设置 set，相当于只读属性

```ts
class Person {
  name: string;
  get Name(): string {
    //可以经过一系列校验，再取值
    return this.name;
  }
  set Name(name: string) {
    //可以经过一系列校验，再赋值
    this.name = name;
  }
}
const p = new Person();
p.Name = 'nick';
console.log(p.Name); //nick
```

- 抽象类 ：做为其它派生类的基类使用。 它们一般不会直接被实例化
  abstract 可以定义抽象类或者抽象属性

  ```ts
  abstract class Animal {
    abstract name: string; //不能有具体实现
    abstract sound(): void; //不能有具体实现
  }
  class Monkey extends Animal {
    name: string;
    constructor(name: string) {
      //super(); 不需要执行super
      this.name = name;
    }
    sound() {
      console.log('giegie');
    }
  }
  const jiji = new Monkey('jiji');
  console.log(jiji.name); //jiji
  jiji.sound(); //giegie
  ```

- 类可以作为类型使用
  ```ts
  class Person {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
  const p: Person = new Person('nick');
  ```
- 类实现接口
  约束类的结构，类必须实现接口中定义的所有属性和方法
  ```ts
  interface Person {
    name: string;
    say(): void;
  }
  class Student implements Person {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    sound() {}
    say() {
      console.log('hello');
    }
  }
  const s = new Student('nick');
  s.say(); //hello
  ```

## 函数

```ts
//函数声明
function fn(a: number, b: number): number {
  return a + b;
}
//函数表达式
const fn: (a: number, b: number) => number = function (a: number, b: number): number {
  return a + b;
};
```

- 函数重载

为同一个函数提供多个函数类型定义
在参数类型不止一种，数量不定的情况下，更精确的定义函数的输入和输出类型

```ts
//数字：相加，字符串：拼接
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  }
}
```

## 类型别名

```ts
type s = string;
type all = string | nummber | boolean;
```

## 字符串字面量类型

```ts
type EventNames = 'click' | 'scroll' | 'mousemove';
```

## 泛型

定义类或者接口时不指定具体类型，而是在使用时指定类型
让函数或类可以支持多种数据类型，增强程序的扩展性
类型和值一样是可以赋值传递的
应用场景： 参数的类型是不定的，执行的时候才确认类型

```ts
function getArr<T>(value: T, count: number): T[] {
  const arr: T[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(value);
  }
  return arr;
}

// const getArr: <T>(value: T, count: number) => T[] =(value: T, count: number): T[]=>{...}
getArr<string>('a', 3); //如果类型不定，会走类型推断

function reserve<T, U>(arr: [T, U]): [U, T] {
  return [arr[1], arr[0]];
}
reserve<string, number>(['1', 2]);
```

- 泛型接口
  ```ts
  interface Fn<T> {
    (arr: T[]): T[];
  }
  function reserve<T>(arr: T[]): T[] {
    return arr.reverse();
  }
  let reservFnc: Fn<number> = reserve;
  reservFnc([1, 2]);
  ```
- 泛型类

  ```ts
  class Person<T, U> {
    name:T,
    age:U,
    constructor(name:T,age:U){
      this.name=name
      this.age=age
    }
  }
  const p = new Person<string,number>("nick",18)
  console.log("🚀 ~ p:", p.name)

  ```

- 泛型约束

```ts
interface ILength {
  length: number;
}
function getLength<T extends ILength>(val: T): number {
  return val.length;
}
getLength(1223); //error number类型不存在length属性
getLength([1, 2]); //error number类型不存在length属性
```

## 装饰器

类装饰器
属性装饰器

## webpack

1. ts-loader 指定哪些文件用到 ts-loader 解析

- tsconfig.json
  用来高速 ts 编译器如何转换 ts 成 js

## Vue3.0 + TS

- PropType

```ts
import { PropType } from 'vue';
interface IAttr{
    key:string,
    value:string
  }
export default {
  props: {
    name: {
      type: string,
      required: true
    }
    attr:{
      type:Object as PropType<IAttr>
    }
  }
};

```

- methods 和 computed

  ```html
  <script lang="ts">
    export default {
      methods: {
        fun(): string {
          return 'a';
        }
      },
      computed: {
        fun(): string {
          return 'a';
        }
      }
    };
  </script>
  ```

- VueX/vue-router 接入 ts

  ```ts
  import { ComponentCustomProperties } from 'vue';
  import { RouteLocationNormalized, Router } from 'vue-router';
  import { Store } from 'vuex';
  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $route: RouteLocationNormalized;
      $router: Router;
      $store: Store;
    }
  }
  ```

- declare module

  ```ts
  declare module '*.vue' {
    import { ComponentOptions } from 'vue';
    const componentOptions: ComponentOptions;
    export default componentOptions;
  }
  ```
