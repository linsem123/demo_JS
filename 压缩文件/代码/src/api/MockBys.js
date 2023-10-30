const Mock = require('mockjs');
// 1.随兴分
// 成功
const getHomedata = {
    success:true,
    data:{
        cardList:[                // 信用卡列表
            {cardKey:"5ec32432-sad3-324",cardNo:"5280 **** **** 1100"},
            {cardKey:"5ec34542-sad3-324",cardNo:"5435 **** **** 0010"},
            {cardKey:"5e2ss432-sad3-324",cardNo:"5228 **** **** 2958"}
        ],
        billDate:"5",             // 账单日
        topAmount:"200000",       // 最高可借金额
        countDown:"0",            // 0显示倒计时，1不显示倒计时
        installList:[
            {payType:"01",planCode:"XJS2014930103",planName:"100000000000003",period:"3",rate:"1.6"},
            {payType:"01",planCode:"XJS2014930106",planName:"100000000000006",period:"6",rate:"2.6"},
            {payType:"01",planCode:"XJS2014930112",planName:"100000000000012",period:"12",rate:"3.6"},
            {payType:"01",planCode:"XJS2014930118",planName:"100000000000018",period:"18",rate:"4.6"},
            {payType:"01",planCode:"XJS2014930124",planName:"100000000000024",period:"24",rate:"5.6"},
            {payType:"01",planCode:"XJS2014930136",planName:"100000000000036",period:"36",rate:"6.6"},
            {payType:"02",planCode:"XJS2014930203",planName:"200000000000003",period:"3",rate:"7.6"},
            {payType:"02",planCode:"XJS2014930206",planName:"200000000000006",period:"6",rate:"8.6"},
            {payType:"02",planCode:"XJS2014930212",planName:"200000000000012",period:"12",rate:"9.6"},
            {payType:"02",planCode:"XJS2014930218",planName:"200000000000018",period:"18",rate:"10.6"},
            {payType:"02",planCode:"XJS2014930224",planName:"200000000000024",period:"24",rate:"11.7"},
            {payType:"02",planCode:"XJS2014930236",planName:"200000000000036",period:"36",rate:"12.7"}
        ],
        discount:true,              // true-有优惠 false-无优惠
        // 分期支付
        discountAmt:"510.00",       // 优惠前每期应还
        discountMoney:"500.00",     // 优惠前每期本金
        discountCharge:"20.00",     // 优惠前每期手续费
        instalAmt:"499.00",         // 每期应还
        eachMoney:"490.00",         // 每期本金
        eachCharge:"10.00",         // 每期手续费
        // 一次性支付
        oneAmt:"500.00",            // 一次性支付每期应还
        discountOneCharge:"40.00",  // 优惠前一次性手续费
        oneCharge:"20.00",          // 一次性手续费
    }
}
const changeMoney = {
    success:true,
    data:{
        discount:true,              // true-有优惠 false-无优惠
        // 分期支付
        discountAmt:"5100.00",       // 优惠前每期应还
        discountMoney:"5000.00",     // 优惠前每期本金
        discountCharge:"200.00",     // 优惠前每期手续费
        instalAmt:"4990.00",         // 每期应还
        eachMoney:"4900.00",         // 每期本金
        eachCharge:"100.00",         // 每期手续费
        // 一次性支付
        oneAmt:"5000.00",            // 一次性支付每期应还
        discountOneCharge:"400.00",  // 优惠前一次性手续费
        oneCharge:"200.00",          // 一次性手续费
    }
}
// const submitdata = {
//     success:true,
//     data:{
//         applyDate:"20190613",       // 申请日期
//         applyAmt:"8000",            // 申请金额
//         returnAmt:"8000",           // 首期还款金额
//     }
// }

// 失败
// const getHomedata = {
//     success:false,
//     msg:"",
//     code:"000001",
// }
// const changeMoney = {
//     success:false,
//     msg:"试算失败",
//     code:"er_000001"
// }
const submitdata = {
    success:false,
    msg:"申请失败",
    code:"er_000001"
}
// Mock.mock(url,post/get,返回的数据)
// 1.随兴分
Mock.mock(/\/info\/getHomedata/,'post',getHomedata);
Mock.mock(/\/info\/changeMoney/,'post',changeMoney);
Mock.mock(/\/info\/submitdata/,'post',submitdata);

// 1.随兴分
Mock.mock("api2/freeWheelingInstallment/mainQuery.json",'post',getHomedata);
Mock.mock("api2/freeWheelingInstallment/trialByStages.json",'post',changeMoney);
Mock.mock("api2/freeWheelingInstallment/mainApply.json",'post',submitdata);