import Vue from "vue";
import CryptoJS from "crypto-js"; //des3加密
import sa from "sa-sdk-javascript"; //听云埋点
export const showX = (num,str)=>{   //信用卡图片上动态显示卡号/背面安全码 与 xxxx
    var n;
    if(str=="cardNo"){
        n=4;
    }else if(str=="safeCode"){
        n=3;
    }
    var l = num.length;
    for(var i=0;i<n-l;i++){
        num+="x"; 
    }
    return num;
}

// 获取字符串长度
export const getLength=(str)=>{
	var realLength = 0;
	var len = str.length;
	for(var i=0;i<len;i++){
		var charCode = str.charCodeAt(i);
		if(charCode >=0 && charCode < 128){
			realLength += 1;
		}else{
			realLength += 2;
		}
	}
	return realLength;
};

//身份证号验证
export const checkIssueDate=(sId)=>{
    if (sId == undefined)return false;
	var aCity = {
		11 : "北京",
		12 : "天津",
		13 : "河北",
		14 : "山西",
		15 : "内蒙古",
		21 : "辽宁",
		22 : "吉林",
		23 : "黑龙江",
		31 : "上海",
		32 : "江苏",
		33 : "浙江",
		34 : "安徽",
		35 : "福建",
		36 : "江西",
		37 : "山东",
		41 : "河南",
		42 : "湖北",
		43 : "湖南",
		44 : "广东",
		45 : "广西",
		46 : "海南",
		50 : "重庆",
		51 : "四川",
		52 : "贵州",
		53 : "云南",
		54 : "西藏",
		61 : "陕西",
		62 : "甘肃",
		63 : "青海",
		64 : "宁夏",
		65 : "新疆",
		71 : "台湾",
		81 : "香港",
		82 : "澳门",
		91 : "国外"
	};

	var iSum = 0;
	var info = "";
	// 是否15、18位数字或17位数字加x
	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(sId))) {
        // alert('身份证号长度不对，或不符合格式要求.');
		return false;
	}
	// 转成18位
	// if (sId.length == 15) {
	// 	sId = certId15To18(sId);
	// }
	sId = sId.replace(/x$/i, "a");
	// 非法地区
	if (aCity[parseInt(sId.substr(0, 2))] == null) {
		// alert('地区不对！');
		return false;
	}
	var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-"
			+ Number(sId.substr(12, 2));
	var d = new Date(sBirthday.replace(/-/g, "/"));
	// 非法生日
	if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
			.getDate())) {
		// alert("生日有误！");
		return false;
	}
	for (var i = 17; i >= 0; i--)
		iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
	// 非法证号
	if (iSum % 11 != 1) {
        // alert("非法证号");
		return false;
	}
	return true;
}
//加密
export const encryptByDES=(message, key)=>{
	const keyHex = CryptoJS.enc.Utf8.parse(key);
	const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
     });
    let data  = encodeURIComponent(encrypted.toString());
	return data;
}

//解密
export const decryptByDES=(ciphertext, key)=>{
	const keyHex = CryptoJS.enc.Utf8.parse(key);
	// direct decrypt ciphertext
	const decrypted = CryptoJS.DES.decrypt({
		ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
	 }, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
    });
	return decodeURIComponent(decrypted.toString(CryptoJS.enc.Utf8));
}

// 解码
export const base64Decode =(input) =>{
	var rv = "";
	rv = window.atob(input);
	rv = escape(rv);
	rv = decodeURIComponent(rv);
	return rv;
}

//听云初始化
export const initsa = (title)=>{ // 进页面埋点
    sa.init({
        server_url:'https://bigdata.cib.com.cn/sa?project=xykfk',
        heatmap:{
            // clickmap:"no_collect"  //关闭
            clickmap:"default"
        }
    });
    sa.quick("autoTrack",{
        $title:title
	});
	return sa.store._state.distinct_id;
}

export const track = (str,name,openId,define)=>{  // 事件埋点
    sa.track(str,{ 
        name:name,
		openId:openId ? openId : "" ,  //用户openId
        define:define ? define : ""    //定义属性，目前用做点分期
    });
}
export const saAlert = (thisPage, trigPosition, errorMsg, errorType) =>{ //报错埋点
	sa.track('Weixinalert', {
		name: 'weixin_提示',
		thisPage: thisPage, // 触发页面
		triggerPosition: trigPosition, // 触发的地方(条件)
		errorContent: errorMsg, // 错误信息
		typeofError: errorType //错误类型 catch:请求失败  isSuccess==false : 报错提示
	});
}

export const rem=()=>{
    var html = document.getElementsByTagName('html')[0];
    var width = html.getBoundingClientRect().width;
    html.style.fontSize = 100/(width*0.01) + 'vw';
}

//pluginName = '', obj = window.plugins
export const checkPlugin=(pluginName)=>{
	let obj=window.plugins;
        let i = pluginName.indexOf('.')
        if (i > 0) {
            return this.checkPlugin(
                pluginName.substring(i + 1),
                obj[pluginName.substring(0, i)]
            )
        } else {
            return (
                obj[pluginName] != null &&
                typeof obj[pluginName] !== 'undefined'
            )
        }
}


// export const setHeight = (height)=>{ //解决ios软键盘收起时页面恢复问题
// 	var screenHeight=window.innerHeight;
// 	var keyboardHeight = screenHeight-height;
// 	window.scrollTo(0,keyboardHeight);
// }

//判断是否支持FileReader
export const supportFileReader = (file) => {
    return !(!file || !window.FileReader);
}

//dataURL转为file对象
export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      	u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}
//图片压缩和旋转
export const compress = (image, Orientation, type) => {
    var degree = 0, drawWidth, drawHeight, width, height;
    drawWidth = image.width;
    drawHeight = image.height;
    var maxSide = Math.max(drawWidth, drawHeight);
    if (maxSide > 1024) {
      var minSide = Math.min(drawWidth, drawHeight);
      minSide = minSide / maxSide * 1024;
      maxSide = 1024;
      if (drawWidth > drawHeight) {
        drawWidth = maxSide;
        drawHeight = minSide;
      } else {
        drawWidth = minSide;
        drawHeight = maxSide;
      }
    }
    var canvas = document.createElement("canvas");
    canvas.width = width = drawWidth;
    canvas.height = height = drawHeight;
    var ctx = canvas.getContext("2d");
    var u = navigator.userAgent;
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      // if(Orientation != "" && Orientation != 1){
      switch (Orientation) {
        case 3://需要180度旋转
          degree = 180;
          drawWidth = -width;
          drawHeight = -height;
          break;
        case 6://需要顺时针（向左）90度旋转
          canvas.width = height;
          canvas.height = width;
          degree = 90;
          drawWidth = width;
          drawHeight = -height;
          break;
        case 8://需要逆时针（向右）90度旋转
          canvas.width = height;
          canvas.height = width;
          degree = 270;
          drawWidth = -width;
          drawHeight = height;
          break;
      }
    }
    ctx.rotate(degree * Math.PI / 180);
    ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
    //进行压缩
    // var newdata = canvas.toDataURL("image/jpeg",0.5);
    var newdata = canvas.toDataURL(type, 0.5);
    canvas = ctx = null;
    return newdata;
}

//获取Blob对象
export const getBlob = (buffer, format) => {
	try {
		return new Blob(buffer, {type: format});
	} catch (e) {
		var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
		buffer.forEach(function(buf) {
			bb.append(buf);
		});
		return bb.getBlob(format);
	}
}
//获取FormData对象
export const getFormData=() => {
	var isNeedShim = ~navigator.userAgent.indexOf('Android')
	&& ~navigator.vendor.indexOf('Google')
	&& !~navigator.userAgent.indexOf('Chrome')
	&& navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
	return isNeedShim ? new FormDataShim() : new FormData()
}

//设置cookie
export const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    console.info(cname + "=" + cvalue + "; " + expires);
    document.cookie = cname + "=" + cvalue + "; " + expires;
    // console.info(document.cookie);
}

  //获取cookie
export const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(name) !== -1) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export const checkName = (name)=>{
	name=name.replace(/\s/g,"");
	if(name==""){
		return "姓名不能为空"
	}else if(!/^[\u4e00-\u9fa5]{2,8}$/.test(name)){
		return "姓名格式不正确";
	}else{
		return ""
	}
}
export const getSearch=(name)=>{ //获取地址栏参数
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    // console.log(window.location.search);
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]); return "";
}
export const setHeight = (height,event,clientY)=>{ //解决ios软键盘收起时页面恢复问题
	let ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf("iphone")!=-1){
		if(event=="focus"){
			setTimeout(function(){
				// 设置body的高度为可视高度+302
				// 302为原生键盘的高度
				let screenHeight=window.innerHeight;
				document.getElementsByTagName('body')[0].style.height = (screenHeight+200) + 'px';
				document.body.scrollTop = 200;
				// document.body.addEventListener('touchmove', function (e) {
				// 	e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
				// }, {passive: false});  //兼容ios/android
			}, 0)
		}else{
			document.getElementsByTagName('body')[0].style.height = height+"px";
			let screenHeight=window.innerHeight;
			let keyboardHeight = screenHeight-height;
			window.scrollTo(0,clientY-keyboardHeight);
			// document.body.removeEventListener('touchmove', function (e) {
			// 	e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
			// }, {passive: false});  //兼容ios/android
			return 
		}
	}else{
		return 
	}
}
export const environment = ()=>{
	let str = location.href;
	if(str.indexOf("ccshop")!=-1){
		return "https://ccshop.cib.com.cn:8010/evercos/main/"
	}else{ 
		if(str.indexOf("html3")!=-1){
				return "https://test.xliane.com/evercos3/main/"
		}else if(str.indexOf("html2")!=-1){
				return "https://test.xliane.com/evercos2/main/"
		}else if(str.indexOf("html")!=-1){
				return "https://test.xliane.com/evercos/main/"
		}else{
			return "localhost:8080/"
		}
	}
}

export const htmlDev = ()=>{  // 前端环境
    let str = location.href;
    let hostname = location.hostname;
    if(str.indexOf("ccshop")!=-1){
        return "https://ccshop.cib.com.cn:8010/html/"
    }else if(str.indexOf("wm.cib")!=-1){
        return "https://wm.cib.com.cn/html/"
    }else{ 
        if(str.indexOf("html3")!=-1){
                return "https://test.xliane.com/html3/"
        }else if(str.indexOf("html2")!=-1){
                return "https://test.xliane.com/html2"
        }else if(str.indexOf("html")!=-1){
                return "https://test.xliane.com/html/"
        }else{
            return "localhost:8080/"
        }
    }
}

export const addDate = (date,days) => {           // 日期的加减  date:操作的日期 days:正数为往后加，负数为往前减
	var d = new Date(date);
	d.setDate(d.getDate()+days);
	var m = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
	return d.getFullYear()+'/'+m+'/'+d.getDate();
}

export const  DateMinus = (date1,date2) => {//date1:小日期   date2:大日期
  　　var sdate = new Date(date1); 
  　　var now = new Date(date2); 
  　　var days = now.getTime() - sdate.getTime(); 
  　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
  　　return day; 
  }



export const channel=()=>{
	let ua = navigator.userAgent.toLowerCase();
	// return "hxdapp";   //测试好兴动mgm
    if (ua.match(/MicroMessenger/i) == "micromessenger") {  // 判断是否是微信浏览器
        return "wechat";
    } else if(ua.split('UCBrowser/').length > 1){  // 判断是否是UC浏览器
        return "ucBrowser";
    } else if(ua.split('MQQBrowser/').length > 1){  // 判断是否是QQ浏览器
        return "qqBrowser"
    }else if(ua.indexOf("gapclient")!=-1){   //好心动
        return "hxdapp"
    }else if(ua.indexOf("cib-ebank/newland")!=-1) {   //手机银行
        if(ua.indexOf("iphone")!=-1){
            return "cibBankiphone"
        }else if(ua.indexOf("android")!=-1){
            return "cibBankandroid"
        }
    }else{
        return ""
    }
}

//校验插件存在且设备为安卓设备或WKWebview的IOS设备
export const hxdappIsSpecial = ()=>{
	// return true;  //测试好兴动mgm
	let ua = navigator.userAgent.toLowerCase();
	// 判断安卓设备
	let isAndroid = ua.indexOf('android') !== -1
	// 判断WKWebview
	let isWk = /"wvtype":"wk"/.test(ua);
	// 校验插件存在且设备为安卓设备或WKWebview的IOS设备
	if((window.plugins && window.plugins.RESTPlugin) && ( isAndroid || isWk)) {
		return true
	}else{
		return false
	}
}
//echart趋势图
export const drawLine=($echarts,dom,max,min,xdata,ydata,name)=>{
    // 基于准备好的dom，初始化echarts实例
    let myChart = $echarts.init(dom)
    // 绘制图表
    myChart.setOption({
        tooltip: {
            trigger:"axis"     //items--默认数据触发   axis
        },
        calculable : false,  //拖拽是否开启重计算
        xAxis: [
            {
                type : 'category',   //默认 category value item log
                boundaryGap : false,     //false-贴合坐标轴  true--横坐标两边空一格
                data : xdata
            }
        ],
        yAxis: [
            {              
                type : 'value',  //'category'  直接赋值
                axisLabel : {
                    formatter: '{value}'
                },
                max:max,
                min:min
            }
        ],
        series: [  
            {
                name:name,
                type:'line',
                clickable: true,  //开启点击
                smooth:true,   //true--lineStyle不支持虚线  false--平滑曲线 折线
                itemStyle: {
                    normal:{ //areaStyle目前仅支持default 实填充
                        areaStyle: {    //阴影部分
                            type: 'default', 
                            color:"rgba(80,132,255,0.80)"
                        },
                        color:"rgba(80,132,255,0.80)",  //节点圈圈
                    }   
                },
                data:ydata
            }
        ]
    });
　　return myChart;
}

//生成1/2年的月 picker 数据
export const makeOneYear = (n)=>{
		let arr = [],temparr=[];
        let d=new Date();
        let year = d.getFullYear();
        let month=d.getMonth()+1;
        for(let i=month;i>0;i--){  //当年的月份
            i=i<10?"0"+i:i;
            let temp = year+'年'+i+'月';
            temparr.push({key:temparr.length,text:temp})
		}
		let m=month
		if(n==2){
			m=0
		}
		for(let i = 12;i>m;i--){
			i=i<10?"0"+i:i;
			let temp = (year-1)+'年'+i+'月';
			arr.push({key:temparr.length+arr.length,text:temp})
		}
		if(n==2){
			if(month!=12){
				for(let i=12;i>month;i--){
					i=i<10?"0"+i:i;
					let date = (year-2)+'年'+i+'月';
					arr.push({key:temparr.length+arr.length,text:date});
				}
			}
		}
		temparr = temparr.concat(arr)
		return temparr
}
