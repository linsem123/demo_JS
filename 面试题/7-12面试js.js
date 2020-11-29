var length = 10;
function fn(){console.log(this.length);}
var obj = {
	length:5,
	methods:function(fn){
		fn();
		arguments[0]();
	}
}
obj.methods(fn,1);//10 2
//fn的this指向是window,arguments[0]()的this指向是arguments,length是argumentsd的方法

function Person(){}
Person.prototype.a = function(){console.log(this.name +'a')}
function Student(neme){this.name = name;}
Student.prototype = new Person();
Student.prototype.b = function(){console.log(this.name + 'b')}
var c = new Student('123');
c.b();//b
c.a();//a
//a和b都在Person的原型链上,name是Student的属性



var name1 = 'derek';
var name2 = 'emma';
console.log('hello' + (name1+name2)?'yes':'no');//yes