
const Mock = require('mockjs');

const getData = {
  success: true,
  data:
    {
      cardList:[
        {
          cardNo:"133***1211",
          cardKey:"AHKD-HSAKD",
          currencyFlag: "I",    //L-单币卡 I-双币卡
        },
        {
          cardNo:"1555***1222",
          cardKey:"AHKD-HSAKD",
          currencyFlag: "L",    //L-单币卡 I-双币卡
        },
        {
          cardNo:"133***1233",
          cardKey:"AHKD-HSAKD",
          currencyFlag: "I",    //L-单币卡 I-双币卡
        },
        {
          cardNo:"1555***1244",
          cardKey:"AHKD-HSAKD",
          currencyFlag: "L",    //L-单币卡 I-双币卡
        },
        {
          cardNo:"133***1255",
          cardKey:"AHKD-HSAKD",
          currencyFlag: "I",    //L-单币卡 I-双币卡
        },
        {
          cardNo:"1555***1266",
          cardKey:"AHKD-HSAKD",
          currencyFlag: "L",    //L-单币卡 I-双币卡
        },
      ],               //第一张是主卡
      currencyType: "840"  ,    //156-人民币可办消分，840-美元可办消分
      rateList:[

        {
          payType: "01",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "12",        // 期数
          rate: "0.02"
        },
        {
          payType: "01",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "6",        // 期数
          rate: "0.01"
        },
        {
          payType: "01",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "18",        // 期数
          rate: "0.03"
        },
        {
          payType: "01",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "3",        // 期数
          rate: "0.03"
        },
        {
          "payType": "01",
          "currencyType": "840",
          "planCode": "2019",
          "period": "3",
          "rate": "0.055",
          "charge":"18"
        },
        {
          "payType": "01",
          "currencyType": "840",
          "planCode": "2019",
          "period": "6",
          "rate": "0.065",
          "charge":"18"
        },

        {
          "payType": "01",
          "currencyType": "840",
          "planCode": "2019",
          "period": "12",
          "rate": "0.085",
          "charge":"18"
        },
        {
          "payType": "01",
          "currencyType": "840",
          "planCode": "2019",
          "period": "18",
          "rate": "0.075",
          "charge":"18"
        },
        {
          payType: "02",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "12",        // 期数
          rate: "0.02"
        },
        {
          payType: "02",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "3",        // 期数
          rate: "0.03"
        },
        {
          payType: "02",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "18",        // 期数
          rate: "0.01"
        },
        {
          payType: "02",       // 01-一次性 02-分期支付
          currencyType: "156",
          planCode: "1111",   //计划编号（存下来，后面传给我）
          period: "6",        // 期数
          rate: "0.01"
        },

        {
          "payType": "02",
          "currencyType": "840",
          "planCode": "2119",
          "period": "6",
          "rate": "0.025",
          "charge":"18"
        },
        {
          "payType": "02",
          "currencyType": "840",
          "planCode": "2119",
          "period": "12",
          "rate": "0.035",
          "charge":"18"
        },
        {
          "payType": "02",
          "currencyType": "840",
          "planCode": "2119",
          "period": "3",
          "rate": "0.015",
          "charge":"18"
        },
        {
          "payType": "02",
          "currencyType": "840",
          "planCode": "2119",
          "period": "18",
          "rate": "0.045",
          "charge":"18"
        }
      ],		//费率
      consumeList:[
        {
          description:"便利店",
          amount:"700.00",
          consumeDate:"2018/08/04",
          tradeType:"231",   //交易类型
          valDate:'2018/08/04',        //入账日期
          purDate:'2018/08/04',        //记录日期
          putTime:'2018/08/04',        //消费时间
          tranNo:'1111',    //交易流水号
        },
        {
          description:"超市",
          amount:"800.00",
          consumeDate:"2019/03/01",
          tradeType:"231",   //交易类型
          valDate:'2019/03/01',        //入账日期
          purDate:'2019/03/01',        //记录日期
          putTime:'2019/03/01',        //消费时间
          tranNo:'2222',    //交易流水号
        },
        {
          description:"便利店",
          amount:"700.00",
          consumeDate:"2018/08/04",
          tradeType:"231",   //交易类型
          valDate:'2018/08/04',        //入账日期
          purDate:'2018/08/04',        //记录日期
          putTime:'2018/08/04',        //消费时间
          tranNo:'1111',    //交易流水号
        },
        {
          description:"超市",
          amount:"800.00",
          consumeDate:"2019/03/01",
          tradeType:"231",   //交易类型
          valDate:'2019/03/01',        //入账日期
          purDate:'2019/03/01',        //记录日期
          putTime:'2019/03/01',        //消费时间
          tranNo:'2222',    //交易流水号
        },
        {
          description:"便利店",
          amount:"700.00",
          consumeDate:"2018/08/04",
          tradeType:"231",   //交易类型
          valDate:'2018/08/04',        //入账日期
          purDate:'2018/08/04',        //记录日期
          putTime:'2018/08/04',        //消费时间
          tranNo:'1111',    //交易流水号
        },
        {
          description:"超市",
          amount:"800.00",
          consumeDate:"2019/03/01",
          tradeType:"231",   //交易类型
          valDate:'2019/03/01',        //入账日期
          purDate:'2019/03/01',        //记录日期
          putTime:'2019/03/01',        //消费时间
          tranNo:'2222',    //交易流水号
        }
      ],
      redPacketNumRMB : '4',
      redPacketNumUSD : '5',
      nextFlag: "1" ,      //0-没有更多记录 1-可翻页
      flag: '1' 	,			   //1-可办消分 0-不可办（提示跳转帐分）

    },
  // msg:'',
  // code:''

  // success: false,
  // msg:"请确保信用卡无到期未还款项，卡片状态正常",
  // code:"000001",
  // data:{
  //       cardList:[
  //         {
  //         cardNo:"133***1221",
  //         cardKey:"AHKD-HSAKD",
  //         currencyFlag: "I",    //L-单币卡 I-双币卡
  //         },
  //         {
  //           cardNo:"1555***1221",
  //           cardKey:"AHKD-HSAKD",
  //           currencyFlag: "L",    //L-单币卡 I-双币卡
  //         },
  //       ]
  // }
};
const getCurrency = {
  success: true,
  data:{
    flag: "0"	,			 //true-可办消分 false-不可办（提示跳转帐分）
    currencyType:"156",
    consumeList:[
      {
        description:"海底捞",
        amount:"388.88",
        consumeDate:"2019/04/01",
        tradeNo: "1221"  , //交易流水号
        tradeType:"231"  //交易类型
      },
      {
        description:"贡茶",
        amount:"28.00",
        consumeDate:"2019/04/01",
        tradeNo: "1221"  , //交易流水号
        tradeType:"231"  //交易类型
      }
    ],
    nextFlag: "1"
  }

  // success: false,
  // msg:"请求失败",
  // code:"000001",
  // data:null
};
const getApply = {
  success: true,
  data:{
    eachReturn:"100.00", //每期应还金额
    eachPrincipal:'98',    //每期应还本金
    eachRate:'2',       //每期应还手续费
    oneRate:'10'  ,      //一次性手续费
    useRed: '1'
  }
  // success: false,
  // msg:"请确保信用卡无到期未还款项，卡片状态正常",
  // code:"000001",
  // data:null
};
// Mock.mock(url,post/get,返回的数据)
const redPacket = {
  success:true,
  code:"",
  msg:"",
  data:{
    currencyType:"156", //156 840
    redPacketRule:"黄金卡的哈打卡的的教案课件斯大林觉得的撒旦吉萨的撒撒", //使用规则
    chargeRedPacketList:[
      {
        id:"111111",
        bonusAmt:"",
        discountRate:"8.5",
        periodDescribe:"12期手续费",
        discountDescribe:"账单分期12期可用账单分期1",
        startDate:"20123313",
        endDate:"20190717",
        flag:"1" //1--可用 0--不可用
      },
      {
        id:"222222",
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
        id:"4444444",
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
};
const countRedPacket = {
//成功
  success: true,
  data:{
    payType:'02' ,        //分期支付
    instalAmt:'600.00',   //每期应还金额
    feachMoney:'500.00',   //每期应还本金
    eachCharge:'100.00',   //每期应还手续费
    discountAmt:'700.00',   //优惠前每期应还
    discountCharge:'200.00',      //优惠前每期手续费
    saleFee:'100.00',      //已减免首期手续费
    //01-一次性
    yeachMoney:'500.00',       //每期应还本金
    oneCharge:'100.00',       //一次性手续费
    discountOneCharge:'200'   //优惠前一次性手续费
  }
  //失败
  // success: false,
  //   msg: ' ',
  //   code: '000001'
};


Mock.mock(/\/consumeInstalment\/getInitInfo.json/,'post',getData);
Mock.mock(/\/consumeInstalment\/changeType.json/,'post',getCurrency);
Mock.mock(/\/consumeInstalment\/applyConsume.json/,'post',getApply);
Mock.mock(/\/redPacket\/applyRedPacketFeesList.json/, 'post', redPacket);
Mock.mock(/\/redPacket\/countRedPacketFee.json/, 'post', countRedPacket);


