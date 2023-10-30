const Mock = require('mockjs');

//进入页面判断及获取初始数据
const getAuthCashIntalStart = { //首页初始化
  success: true,
  data: {
    accountName:"YL",
    certNo:"32432435255432543",
    xjfq: 'YES',				//是否办理现金分期(NO:不办，YES:办)
    lastCalava: '30000.12',		//可申请办理分期余额
    instalmentResult: {
      discount: false, //是否有优惠			（01:优惠，02不优惠）
      flag: "01", //支付方式					（01：一次性支付，02：分期）
      instalAmt: '100', //每期应还
      eachMoney: '100', //每期本金
      eachCharge: '100', //每期手续费
      discountAmt: '100', //优惠前每期应还
      discountMoney: '100', //优惠前每期本金
      discountCharge: '100', //优惠前每期手续费
      oneAmt: '100', //一次性每期本金
      oneCharge: '100', //一次性手续费
      discountOneCharge: '1010', //优惠后一次性手续费
      onePay: '100', //一次性每期应还
      extra: '20'//跨行转账另收
    },
    usageListStrings: [
      {
          "useageKey": "1",
          "dsc": "家用电器消费"
      },
      {
          "useageKey": "2",
          "dsc": "家庭消费"
      },
      {
          "useageKey": "3",
          "dsc": "医疗消费"
      },
      {
          "useageKey": "4",
          "dsc": "购车消费"
      },{
        "useageKey": "5",
        "dsc": "婚庆消费"
    },
    {
        "useageKey": "6",
        "dsc": "助学消费"
    },
    {
        "useageKey": "7",
        "dsc": "旅游消费"
    },{
      "useageKey": "9",
      "dsc": "其他消费"
    }],		//资金用途
    debitcardList:[['74847319','招商银行'],['7847632874',"建设银行"],['314342342',"兴业银行"]],			//收款方
    cardList:[{
          "cardNo": "4512 **** **** 3208",
          "cardkey": "491540d5-eed3-4c3b-9ce0-ead66c827093"
      },
      {
          "cardNo": "4512 **** **** 0104",
          "cardkey": "429a1ab7-0a87-480a-be5f-69ccf31beec3"
      },
      {
          "cardNo": "4512 **** **** 0203",
          "cardkey": "779e7c29-f361-45be-9734-62bd609b308e"
      },
      {
          "cardNo": "4512 **** **** 1105",
          "cardkey": "feebf5f0-51e4-4be2-97ee-a2b979a755e2"
      },
      {
          "cardNo": "4512 **** **** 9089",
          "cardkey": "94a60854-8b4b-4c62-a73f-e49896203971"
      },
      {
          "cardNo": "4512 **** **** 9097",
          "cardkey": "94806879-4bff-4f2b-97ad-e81f866e4c86"
      },
      {
          "cardNo": "4512 **** **** 9105",
          "cardkey": "f94ca99e-1feb-423f-bb44-5e306d5574b9"
      },
      {
          "cardNo": "4512 **** **** 9329",
          "cardkey": "a4c8594b-258c-4ae8-9b71-56b0ee7da6cc"
      }], //卡列表
    rateInfos:[
        {
            "pay_type": "01",
            "plan_code": "4017",
            "plan_name": null,
            "period": "3",
            "rate": "0.027"
        },
        {
            "pay_type": "01",
            "plan_code": "4017",
            "plan_name": null,
            "period": "6",
            "rate": "0.048"
        },
        {
            "pay_type": "01",
            "plan_code": "4017",
            "plan_name": null,
            "period": "12",
            "rate": "0.090"
        },
        {
            "pay_type": "01",
            "plan_code": "4017",
            "plan_name": null,
            "period": "18",
            "rate": "0.1350"
        },
        {
            "pay_type": "01",
            "plan_code": "4017",
            "plan_name": null,
            "period": "24",
            "rate": "0.1728"
        },
        {
            "pay_type": "01",
            "plan_code": "4017",
            "plan_name": null,
            "period": "36",
            "rate": "0.2448"
        },
        {
            "pay_type": "02",
            "plan_code": "4018",
            "plan_name": null,
            "period": "3",
            "rate": "0.009"
        },
        {
            "pay_type": "02",
            "plan_code": "4018",
            "plan_name": null,
            "period": "6",
            "rate": "0.008"
        },
        {
            "pay_type": "02",
            "plan_code": "4018",
            "plan_name": null,
            "period": "12",
            "rate": "0.008"
        },
        {
            "pay_type": "02",
            "plan_code": "4018",
            "plan_name": null,
            "period": "18",
            "rate": "0.008"
        },
        {
            "pay_type": "02",
            "plan_code": "4018",
            "plan_name": null,
            "period": "24",
            "rate": "0.008"
        },
        {
            "pay_type": "02",
            "plan_code": "4018",
            "plan_name": null,
            "period": "36",
            "rate": "0.008"
        }
      ],
  },
  msg: '失败',
  code: '000001'
};

const trialByCashInstall = { //试算
  success: true,
  data:{
      discount:true,    ///false   //是否有优惠
      flag:"02",   //01-一次性支付,02-分期支付  //支付方式
      instalAmt:"12",//每期应还 
      eachMoney:"23",  //每期本金
      eachCharge:"123",//每期手续费
      discountAmt:"32",//优惠前每期应还 
      discountMoney:"31",//优惠前每期本金
      discountCharge:"211",//优惠前每期手续费
      oneAmt:"12",//一次性每期本金
      oneCharge:"21",//一次性手续费
      discountOneCharge:"32",//优惠前一次性手续费
      onePay:"312",//一次性首期应还
    },
    //失败
    // success: false,
  msg: 'ooo',
  code: '000001'
}

const sendSmsCode = {  //验证码
  success:true,
  data:{
    smsCode:'123456',
    noFirstSend:"1",  //1发送短信  0获取滑块
  }
}

const getSlider = {  //获取滑块
  success:true,
  data:{
    bigimgStr:'',
    tarimgStr:"",  //1发送短信  0获取滑块
  }
}

const getCardBank = {  //根据卡号 获取银行卡名
  isSuccess:true,
  msg:"",
  data:[["213309391000011","中国广大银行"]]
}
const getBankInfo = {  //搜索获取列表
  isSuccess:true,
  msg:"",
  data:[["兴业银行","309391000011"],["兴业银行","309391000011"],["招商银行","309391000011"],["广发银行","309391000011"],["建设银行","309391000011"],["广发银行","309391000011"],["建设银行","309391000011"],["工商银行","309391000011"],
  ["浦发银行","309391000011"],["农业银行","309391000011"]]
}

const addBankInfo = {  //确定添加按钮
  isSuccess:true,
  msg:"",  //新增数据失败
  data:{}
}

const deleteBank = {
  isSuccess:true,
  msg:"",  //新增数据失败
  data:{}
}
const changeCard = {
  success:true,
  code:"",
  msg:"",
  data:{
    accountName:"1122",
    xjfq:"YES",
    certNo:"",
    lastCalava:"60000",
    instalmentResult:{
      flag:"02"
    }
  }
}

const applySuccess = { //申请成功
  success:true,
  code:'',
  msg:'',
  data:{
    "debitBank":"中国工商银行",   //借记卡
    "debitCard":"6222222222222222",  //借记卡号
    "xykkh":"4512890012428105",  
    "myhke":"55.56",       //首期应还
    "jyrq":"2019/03/19",   
    "sxf1":"20.00",
    "fqqs":"018",
    "jyje":"1000.00",     //交易金额
    "sqhkr":"2019/04/19",  //收期还款日
    "debitBankNo":"102100099996",  // 借记卡 卡bin
    "sxf":"144.00",
    "finalAmt":"3313"
  }
}
const getMsg = {  //推广 短信
  code: '1111',
  data:{
    bigimgStr: null,
    needSlider: false,
    smsCodeAlert: "868212",
    tarimgStr: null,
  },
  msg: '7777',
  success: true
}

const shareConfig ={"success":true,"code":"CR_000000","msg":null,"data":{"remcode":"7ac262f2-33e8-4628-a493-90598f9e90c120190318","data":{"timestamp":"1552906541","appId":"wx5bdce924ff32539f","noncstr":"c22d626c-9db8-41cd-966c-0bde01df26a3","signature":"A7A11C107CD2CD1861CECDD78914248E910EB250"},"code":"000000"}}


const redPacket = {
  success:true,
  code:"",
  msg:"",
  data:{
      currencyType:"156",  //156   840
      redPacketRule:"黄金卡的哈打卡的的教案课件斯大林觉得的撒旦吉萨的撒撒",        //使用规则
      chargeRedPacketList:[
        {
          id:"",
          bonusAmt:"",
          discountRate:"8.5",
          periodDescribe:"12期手续费",
          discountDescribe:"账单分期12期可用账单分期1",
          startDate:"20123313",
          endDate:"20190717",
          flag:"0"  //1--可用  0--不可用
        },
        {
          id:"",
          bonusAmt:"122.32",
          discountRate:"",
          periodDescribe:"12期手续费",
          discountDescribe:"账单分期12期可用账单分期1",
          startDate:"20123313",
          endDate:"20190513",
          flag:"0"  //1--可用  0--不可用
        },
        {
          id:"",
          bonusAmt:"",
          discountRate:"8.5",
          periodDescribe:"12期手续费",
          discountDescribe:"账单分期12期可用账单分期1",
          startDate:"20123313",
          endDate:"20190513",
          flag:"0"  //1--可用  0--不可用
        },
        {
          id:"",
          bonusAmt:"100",
          discountRate:"",
          periodDescribe:"12期手续费",
          discountDescribe:"账单分期12期可用账单分期1",
          startDate:"20123313",
          endDate:"20190513",
          flag:"0"  //1--可用  0--不可用
        }
      ],
  }
}

Mock.mock(/\/redPacket\/applyRedPacketFeesList/, 'post', redPacket);  //红包


Mock.mock(/\/cashInstalment\/getAuthCashInstalStart/, 'post', getAuthCashIntalStart);
Mock.mock(/\/trial\/trialByCashInstall/, 'post', trialByCashInstall);
Mock.mock(/\/smsSlider\/sendSmsCode/, 'post', sendSmsCode);
Mock.mock(/\/getSlider/, 'post', getSlider);
Mock.mock(/\/getCardBank/, 'post', getCardBank);
Mock.mock(/\/getBankInfo/, 'post', getBankInfo);
Mock.mock(/\/addBankInfo/, 'post', addBankInfo);
Mock.mock(/\/changeCard/, 'post', changeCard);
Mock.mock(/\/apply/, 'post', applySuccess);


Mock.mock(/\/generalSpread\/sendSmsCode.json/,'post',getMsg);   //推广短信
Mock.mock(/\/generalSpread\/getMsgConfig/, 'post', shareConfig);  //推广分享




