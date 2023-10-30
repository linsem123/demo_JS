const Mock = require('mockjs');
// 首页查询接口
const  homedata={
    success:true,
    msg:"",
    data:{
        "cardList":[
            {"cardKey":"12345667","cardNo":"1232 *** *** 1111","cardType":"L"},
            {"cardKey":"23456778","cardNo":"4562 *** *** 2222", "cardType":"I" },
            {"cardKey":"32345667","cardNo":"1232 *** *** 4444","cardType":"I"},
            {"cardKey":"12345667","cardNo":"1232 *** *** 5555","cardType":"I"},
         ],
         "installParam":[
            {
                payType: "01",
                currencyType: "156",
                planCode: "2009",
                period: "3",
                rate: "0.2222",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "156",
                planCode: "2009",
                period: "6",
                rate: "0.1428",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "156",
                planCode: "2009",
                period: "12",
                rate: "0.1870",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "156",
                planCode: "2019",
                period: "18",
                rate: "0.789",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "156",
                planCode: "2019",
                period: "24",
                rate: "0.042",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "156",
                planCode: "2019",
                period: "36",
                rate: "0.080",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "840",
                planCode: "2009",
                period: "3",
                rate: "0.4444",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "840",
                planCode: "2009",
                period: "6",
                rate: "0.1428",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "840",
                planCode: "2009",
                period: "12",
                rate: "0.1872",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "840",
                planCode: "2019",
                period: "18",
                rate: "0.789",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "840",
                planCode: "2019",
                period: "24",
                rate: "0.042",
                charge:"18"
            },
            {
                payType: "01",
                currencyType: "840",
                planCode: "2019",
                period: "36",
                rate: "0.080",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "156",
                planCode: "2009",
                period: "3",
                rate: "0.1111",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "156",
                planCode: "2009",
                period: "6",
                rate: "0.1428",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "156",
                planCode: "2009",
                period: "12",
                rate: "0.1872",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "156",
                planCode: "2019",
                period: "18",
                rate: "0.789",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "156",
                planCode: "2019",
                period: "24",
                rate: "0.042",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "156",
                planCode: "2019",
                period: "36",
                rate: "0.080",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "840",
                planCode: "2009",
                period: "3",
                rate: "0.0085",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "840",
                planCode: "2009",
                period: "6",
                rate: "0.1428",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "840",
                planCode: "2009",
                period: "12",
                rate: "0.1872",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "840",
                planCode: "2019",
                period: "18",
                rate: "0.789",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "840",
                planCode: "2019",
                period: "24",
                rate: "0.042",
                charge:"18"
            },
            {
                payType: "02",
                currencyType: "840",
                planCode: "2019",
                period: "36",
                rate: "0.080",
                charge:"18"
            }
           
     ],
      flag:"0",    //0/1/2
     billAmt:"2000.00",
     returnAmt:"2000.00",
     smppamt:"2000.00",
     instalAmt:"510",
     eachMoney:"166.66",
     eachCharge:"15",   
     currencyType: "156", 
     cardNoFirst:"23456778",
     redPacketNumRMB:"6",
     redPacketNumUSD:"2",//红包个数 (美元) 无红包：0
     
    },
    // success:false,
    // msg:'请求失败',
    // code:'000001'
}
Mock.mock(/mainApply.json/,'post',homedata);

// 切换卡片
const cardData = {
    success:true,
    data:{
                cardType:"I",                           //L/I
                currencyType:"156",           //156-人民币，840-美元  切换美元/人民币时才给值
                billAmt:"2000.00",              //账单金额
                returnAmt:"10001.00",           //剩余应还（人民币）
                smppamt:"502.00" ,               //可申请分期金额
                instalAmt:"502.00",              //每期应还
                eachMoney:"502.00",             //每期本金
                eachCharge:"12.00"  ,            //每期手续费
                haveEnvelop:true,                //true-有红包，false-无红包
        },
        // success: false,
        // msg: '请求失败card ',
	    // code: '000001'
    
   
}
// Mock.mock(/\/card\/carddata/,'post',cardData);
Mock.mock(/applyByCardNo.json/,'post',cardData);

// 切换币种
const  setBtn = {
   success:true,
   data:{
            cardType:"L",                          //L/I
            currencyType:"840",            //156-人民币，840-美元  切换美元/人民币时才给值,
            billAmt:2000.00,            //账单金额
            returnAmt:1000.00,          //剩余应还（人民币）,
            smppamt:300.00,            //可申请分期金额
            instalAmt:510.00,          //每期应还
            eachMoney:166.66,          //每期本金
            eachCharge:25.00,           //每期手续费
            haveEnvelop:false           //true-有红包，false-无红包
    },
    // success: false,
    // msg: ' ',
	// code: '000001',
}
Mock.mock(/applyByCurrencyType.json/,'post',setBtn);
// 试算红包
const JsRedBag = {
    success:true,
    data:{
        payType:"02",//分期支付
       //payType:02//01-一次性支付，02-分期支付
        instalAmt:"601.00",//每期应还金额
        feachMoney:"501.00",//每期应还本金
        eachCharge:"101.00",//每期应还手续费
        discountAmt:"700.00",//优惠前每期应还
        discountCharge:"200.00",//优惠前每期手续费
        saleFee:"100.00",//已减免首期手续费
               
               //01-一次性
       yeachMoney:"500.00",//每期应还本金
       oneCharge:"100.00",//一次性手续费
      discountOneCharge:"200"//优惠前一次性手续费
       },
    // success: false,
    // msg: ' ',
	// code: '000001',
}
Mock.mock(/countRedPacketFee.json/,'post',JsRedBag);

//申请接口
const  setDefinite = {
    success: true,
    data:
	{ 
		cardNo:'2345 **** **** 12345',
		currencyType:840,           //156-人民币，840-美元
		smppamt:30009999999999999.00,           //分期金额
		payType:'01',                 //01-一次性支付，02-分期支付
		period:24,                  //分期期数
		bag:1,                     //0-无优惠，1-红包优惠已享受
		//02-分期支付
		instalAmt:510.00,           //每期应还金额
		feachMoney:500.00,             //每期应还本金
		eachCharge:10.00,              //每期应还手续费
		//01-一次性
		yeachMoney:170.00,             //每期应还本金
		oneCharge:166.00,             //一次性手续费
    } ,
    // success: false,
	// code:'000001',
    // msg:'失败原因',
}
Mock.mock(/applyBillStage.json/,'post',setDefinite);

//红包列表
const redPacket = {
    success:true,
    code:"",
    msg:"",
    data:{
    currencyType:"156", //156 840
    redPacketRule:"黄金卡的哈打卡的的教案课件斯大林觉得的撒旦吉萨的撒撒", //使用规则
    chargeRedPacketList:[
    {
    id:"1111",
    bonusAmt:"",
    discountRate:"8.5",
    periodDescribe:"12期手续费",
    discountDescribe:"账单分期12期可用账单分期1",
    startDate:"20123313",
    endDate:"20190717",
    flag:"1" //1--可用 0--不可用
    },
    {
    id:"2222222",
    bonusAmt:"122.32",
    discountRate:"",
    periodDescribe:"12期手续费",
    discountDescribe:"账单分期12期可用账单分期1",
    startDate:"20123313",
    endDate:"20190513",
    flag:"1" //1--可用 0--不可用
    },
    {
    id:"333333",
    bonusAmt:"",
    discountRate:"8.5",
    periodDescribe:"12期手续费",
    discountDescribe:"账单分期12期可用账单分期1",
    startDate:"20123313",
    endDate:"20190513",
    flag:"0" //1--可用 0--不可用
    },
    {
    id:"444444",
    bonusAmt:"100",
    discountRate:"",
    periodDescribe:"12期手续费",
    discountDescribe:"账单分期12期可用账单分期1",
    startDate:"20123313",
    endDate:"20190513",
    flag:"1" //1--可用 0--不可用
    }
    ],
    }
    }  
Mock.mock(/\/redPacket\/applyRedPacketFeesList/, 'post', redPacket);