### css绘制三角形原理 ###
* 利用border  
html
```
<div class="box"></div>
```   
css  
* step1
```
.box{
    width:5px;
    height:5px;
    border:10px solid transparent;
    border-top-color:red;
    border-right-color:green;
    border-bottom-color:blue;
    border-left-color:yellow;
}
``` 
* step2 width:0;height:0 就可以组合出各个方向的三角形
```
.box{
    width:0px;
    height:0px;
    border:10px solid transparent;
    border-top-color:red;
    border-right-color:green;
    border-bottom-color:blue;
    border-left-color:yellow;
}
``` 
### css 变量 ### 
* 变量声明，变量名前加--（--foo） 
* 大小写敏感  
* 不能用于属性名，只能作为属性值 
* var(--foo)函数用于读取变量 
 >var(--foo,defaultValue)函数可以有两个参数，第二个参数作为默认值，且第二个参数不处理内部的逗号或空格，都视作参数的一部分，看作一个字符串  
* 变量类型  
>字符串只可以和字符串拼接 
>数值与单位不能直接拼接，需通过calc()。注：calc()运算常量与变量间的运算符两侧不需加空格，常量与常量间的运算符两侧需有空格eg：calc(var(--line_num)*60deg + 30deg)
>变量值带有单位就不能作为字符串 
* 作用域，可以在多个选择器内声明变量，读取的时候优先级最高的生效，与 CSS 的"层叠"规则是一致的。

html
```
    <ul class="strip-loading">
        <li style="--line_index:1"></li>
        <li style="--line_index:2"></li>
        <li style="--line_index:3"></li>
        <li style="--line_index:4"></li>
        <li style="--line_index:5"></li>
    </ul>
```
css
```
     @keyframes aaa {
            0% {height:30px}
            50% {height:10px}
            100%{height:30px}
        }
        .strip-loading{
            list-style-type: none;
            display: flex;
            align-items: center;
        }
        li{
            --time: calc(var(--line_index)*200ms);
             background: red;
             width:6px;
             height: 30px;
             border-radius: 3px;
             animation: aaa 1s ease-in-out var(--time) infinite;
             /* animation: name duration timing-function delay iteration-count direction fill-mode; */
        }
        li + li{
            margin-left: 5px;
        }
    </style>
```
 
 ### css伪元素和伪类 ### 
 * 常用伪元素: 
 >  ::before、::after、::selection、::first-letter、::first-line等
 * 常用伪类 
 > :hover、:checked、:disabled、:first-of-type、:first-child、:nth-child(n)等

 >a:link {color:#FF0000;} /* 未访问的链接 */  
 >a:visited {color:#00FF00;} /* 已访问的链接 */  
 >a:hover {color:#FF00FF;} /* 鼠标划过链接 */  
 >a:active {color:#0000FF;} /* 已选中的链接 */
 * 伪元素和伪类区别 
 >明显区别伪元素::两个冒号，伪类:一个冒号 
 >伪元素通常是一些实体选择器，选择满足指定条件的DOM； 
  伪类通常是一些状态选择器，选择处于特定状态的DOM；

  使用::before和::after实现心形

  html
  ```
  <div class="heart_box"> </div>
  ```
  css
  ```
    .heart_box{
        --heart-color:red;
        position: absolute;
        background: var(--heart-color);
        transform: rotate(45deg);
        width: 100%;
        height: 100%;
        cursor: pointer;
        display: inline-block;
    }
   .heart_box::after,.heart_box::before{
        position: absolute;
        content: '';
        display: inline-block;
        background: var(--heart-color);
        width: 30px;
        height:30px;
        border-radius: 15px;
    }
    .heart_box::before{
    transform: translateX(-50%)
    }
    .heart_box::after{
    transform: translateY(-50%);
    }
  ```
使用input:checked 和 ~ 实现样式切换
 