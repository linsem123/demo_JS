//11月24日练习
{
	function test (){
		var n = 11;
		function add (){
			n++;
			console.log(n)
		}
		return {n:n,method:add}
	}
	var result1 = test();
	var result2 = test();
	result1.method();
	result1.method();
	console.log(result1.n);
	result2.method();
}


{
	for(let i = 0; i < 2; i++){
		setTimeout(()=>{
			console.log("first:"+i)
		},200)
	}
	for (var i = 0; i < 2; i++) {
		console.log("second:"+i)
	}
	for (var i = 0; i < 2; i++) {
		setTimeout(()=>{
			console.log("third:"+i)
		},200)
	}
}
