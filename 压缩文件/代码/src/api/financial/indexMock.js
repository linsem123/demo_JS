const Mock = require('mockjs');
const isopened = {
    success:true,
    msg:"",
    code:"",
    data:1   //0-未开户  1-已开户
}
Mock.mock(/isopened/, 'post', isopened);  


const bankingAccount={
    success:true,
    msg:"",
    code:"",
    data:{
        tradeFlag:1,    //是否有过交易记录 0-无 1有
        proBalance:"3232.00",       //理财持仓
        lastEarning:"232.00",      //昨日收益
        acctBalance:"708.00",      //添利账户余额
        totalAmt:"0.87766"
    }
}
Mock.mock(/bankingAccount/, 'post', bankingAccount);  

const wealthProduct={
    success:true,
    msg:"",
    code:"",
    data:{
        qiriAnnualized:"78.000",  //七日年化
        wanfenIncome:"232.00",    //万分收益
        qiriTrend:[
            {
                date:"05/10",
                qiri:"3.741"  
            },
            {
                date:"05/11",
                qiri:"3.7425"
            },
            {
                date:"05/12",
                qiri:"3.754"
            },
            {
                date:"05/13",
                qiri:"3.7455"
            }
        ],
        wanfenTrend:[
            {
                date:"06/11",
                wanfen:"3.7455"
            },
            {
                date:"06/12",
                wanfen:"3.754"
            },
            {
                date:"06/13",
                wanfen:"3.7425"
            },{
                date:"06/14",
                wanfen:"3.741"
            }

        ],
        proInfo:{
            name:"基金死啊",   //全称
            org:"兴业英航",    //机构
            risk:"3",   //风险  1-基本无风险 2-低风险 3-较低风险 4-中等风险 5-较高风险 6-高风险
            capitalFlag:"0",   //是否保本 0-非保本 1-是
            adv:"萨达萨达",           //公告详情
            lowAmt:"1.0002",        //最低狗购买金额
            stepAmt:"21221.000"        //递增金额
        },
    }
}
Mock.mock(/wealthProduct/, 'post', wealthProduct);  //红包


const bankingDetail={
    success:true,
    msg:"",
    code:"",
    data:{
        detailList:[
            {
                amount:"",
                name:"",
                date:""
            },{
                amount:"",
                name:"",
                date:""
            },
        ]
    }
}
Mock.mock(/bankingDetail/, 'post', bankingDetail);  //红包
