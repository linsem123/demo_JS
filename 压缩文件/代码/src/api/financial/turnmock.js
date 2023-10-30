const Mock = require('mockjs');

//转入首页查询接口
const turnHome = {
    success: true,
    msg:"",
	code:'000001',
    data:
    {
        cardList:[
            {cardKey:'2234-672e-4cf3-sfjsdkfslkda',cardInfo:"兴业银行信用卡(1234)",cardType:"1",availAmt:"123.11",bankLoge:"a.jpg"},
            {cardKey:'2234-672e-4cf3-sfjsdkfslkdb',cardInfo:"兴业银行借记卡(1234)",cardType:"2",availAmt:"",bankLoge:"b.jpg"},
            {cardKey:'2234-672e-4cf3-sfjsdkfslkdc',cardInfo:"兴业银行信用卡(1234)",cardType:"1",availAmt:"322",bankLoge:"c.jpg"},
          ],
        
    },
    // success: false,
    // msg:"查询失败了",
    // code:'000001',

}
// Mock.mock(/upQuery.json/, 'post', PromotionHome);
Mock.mock(/getInCardList.json/, 'post', turnHome);

//确定转入接口
const subEnter = {
    // success: true,
    // code:"0000",
    // msg:"",
    // data:{
    //         money:"100.15",
    //         balance:"999.99",
    //         cardName:"平安银行借记卡",
    //         cardNo:"1234 ****　**** 4567",
    //         operationTime:"2019/05/20 19.00.01"
    // },

    success: false,
    msg:"",
	code:'000001',
 }
Mock.mock(/fundRollIn.json/, 'post', subEnter);


// //开户提交
// const applydoor = {
//     success: true,
//     msg:"",
// 	code:'000002',
//     data:
//     {
//       cardNo:"4512 **** **** 4125"
//     },
//     // success: false,
//     // msg:"查询失败了",
//     // code:'000001',

// }
// Mock.mock(/opencommit.json/, 'post', applydoor);

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
// --------------------------------------------------------------

//转出首页查询接口
const outHome = {
    success: true,
    msg:"",
	code:'000001',
    data:
    {
        cardList:[
            {cardKey:'2234-672e-4cf3-sfjsdkfslkda',cardInfo:"兴业银行信用卡(1234)",cardType:"1",availAmt:"120.11",bankLoge:"a.jpg"},
            {cardKey:'2234-672e-4cf3-sfjsdkfslkdb',cardInfo:"兴业银行借记卡(1234)",cardType:"2",availAmt:"220.11",bankLoge:"b.jpg"},
            {cardKey:'2234-672e-4cf3-sfjsdkfslkdc',cardInfo:"兴业银行信用卡(1234)",cardType:"1",availAmt:"320",bankLoge:"c.jpg"},
          ],  
    },
    // success: false,
    // msg:"查询失败了",
    // code:'000001',
}
Mock.mock(/getOutCardList.json/, 'post', outHome);

//确定转出接口
const outEnter = {
    success: true,
    code:"0000",
    msg:"",
    data:{
            money:"100.15",
            balance:"999.99",
            cardName:"平安银行借记卡",
            cardNo:"1234 ****　**** 4567",
            operationTime:"2019/05/20 19.00.01"
    },

    // success: false,
    // msg:"",
	// code:'000001',
 }
Mock.mock(/fundRollOut.json/, 'post', outEnter);




