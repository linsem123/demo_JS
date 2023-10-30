const Mock = require('mockjs');

//查询接口
const doorHome = {
    success: true,
    msg:"",
	code:'000001',
    data:
    {
            cardList: [
                {
                    cardKey: "df1c7e7f-5d4f-4f1d-9bf3-ebb87e708d06",
                    cardNo: "4512 **** **** 0420",
                },
                {
                    cardKey: "6eb3c4cb-55cb-46ec-bc39-69bc94ad69e9",
                    cardNo: "4512 **** **** 4121",
                },
                {
                    cardKey: "1f1c7e7f-5d4f-4f1d-9bf3-ebb87e708d06",
                    cardNo: "4512 **** **** 0422",
                },
                {
                    cardKey: "2eb3c4cb-55cb-46ec-bc39-69bc94ad69e9",
                    cardNo: "4512 **** **** 4123",
                },
                {
                    cardKey: "3f1c7e7f-5d4f-4f1d-9bf3-ebb87e708d06",
                    cardNo: "4512 **** **** 0424",
                },
                {
                    cardKey: "4eb3c4cb-55cb-46ec-bc39-69bc94ad69e9",
                    cardNo: "4512 **** **** 4125",
                }
            ],
        
            idNo:"1111 **** **** 2222",
            userName:"小王",
            phone:"1361****7758",
            branchNo:"0856"
    },
    // success: false,
    // msg:"查询失败了",
    // code:'000001',

}
// Mock.mock(/upQuery.json/, 'post', PromotionHome);
Mock.mock(/readyopen.json/, 'post', doorHome);

//切卡
const changeCard = {
    success: true,
    code:"0000",
    msg:"切卡成功",
    data:{
            idNo:"3333 **** **** 4444",
            userName:"小王",
            phone:"182****1314",
            branchNo:"0899"
    },

    // success: false,
    // msg:"",
	// code:'000001',
 }
Mock.mock(/changeCard.json/, 'post', changeCard);

//开户提交
const applydoor = {
    success: true,
    msg:"",
	code:'000002',
    data:
    {
      cardNo:"4512 **** **** 4125"
    },
    // success: false,
    // msg:"查询失败了",
    // code:'000001',

}
Mock.mock(/opencommit.json/, 'post', applydoor);

// 请求短信
const sendSmsCode = {
	//成功
success: true,
data:{
		smsCode:"123789",//短信验证码
        noFirstSend:"1"//0-调取获取滑块接口 1-发短信
	  },

	//失败
	// success:false,
	// //特殊报错code及msg
    // code:'ERR_01',msg:"操作频繁，稍后重试",//今日短信发送上限等
    // code:'ERR_02', msg:"滑块请求次数过多,请60秒后重试",//（倒计时60s标志）
    // code:'ERR_04',msg:"滑块请求过多，请稍后重试",
    // code:'1001'  //其他情况
	
}
Mock.mock(/sendSmsCode.json/, 'post', sendSmsCode);
// 请求滑块
const getSlider = {
success: true,
data:{
    bigimgStr:"",//大图
    tarimgStr:"",//小图
},	
//失败
// success: false,
// msg: '',
// code: '000001'
}
Mock.mock(/getSlider.json/, 'post', getSlider);






