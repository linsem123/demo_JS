const Mock = require('mockjs');
const addInfo = {
    success:true,
    data:{
        custName:"张三",
        phone:"158 **** 3332",
        idNo:"333423 **** **** 1234",
        overdueMoney:"200.22",
        lcptCardList:[
            {
                cardKey:"d8374sa247sad834-34shd8sh34",
                cardNo:"4512 **** **** 0420",
                cardType:"1",
                limitMoney:"300.00",
                bankName:"招商银行",
                bankLogo:"1.png",
            },
            {
                cardKey:"d8374sa247sad834-34shd8sh34",
                cardNo:"4533 **** **** 5655",
                cardType:"2",
                limitMoney:"200.00",
                bankName:"平安银行",
                bankLogo:"2.png",
            },
            {
                cardKey:"d8374sa247sad834-34shd8sh34",
                cardNo:"4452 **** **** 0765",
                cardType:"3",
                limitMoney:"500.00",
                bankName:"民生银行",
                bankLogo:"3.png",
            },
            {
                cardKey:"d8374sa247sad834-34shd8sh34",
                cardNo:"4452 **** **** 0765",
                cardType:"3",
                limitMoney:"500.00",
                bankName:"民生银行",
                bankLogo:"3.png",
            },
            {
                cardKey:"d8374sa247sad834-34shd8sh34",
                cardNo:"4452 **** **** 0765",
                cardType:"3",
                limitMoney:"500.00",
                bankName:"民生银行",
                bankLogo:"3.png",
            },
        ],
        lcptBankInfoList:[
            {
                bankName:"招商银行",
                bankCode:"3088932749327",
                bankNo:"0308",
                bankLogo:"1.png"
            },
            {
                bankName:"交通银行",
                bankCode:"3088932749327",
                bankNo:"0308",
                bankLogo:"1.png"
            }
        ]
    }
}
// const searchInfo = {
//     success:true,
//     data:{
//         lcptBankInfoList:{
//             bankName:"招商银行",
//             bankCode:"3088932749327",
//             bankNo:"0308",
//             bankLogo:"1.png"
//         }
//     }
// }
const searchInfo = {
    success:false,
    msg:"未获取到卡号对应信息",
    code:"000001"
}

const increaseInfo = {
    success:true,
    data:"",
}

Mock.mock(/api2\/lcptBindCard\/queryCardList.json/, 'post', addInfo);  

Mock.mock(/api2\/lcptBindCard\/getBankByCardBin.json/, 'post', searchInfo);  

Mock.mock(/api2\/lcptBindCard\/addDebitCard.json/, 'post', increaseInfo); 