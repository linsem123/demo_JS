/*************************************后台系统接口*************************************/
/**报文头*/
发送数据{
	"token":"",
	"reqBody":"JSON格式请求报文体"
}

返回数据{
	"resCode":"GR000000",//GR000000成功，其它失败
	"resMsg":"",
	"resBody":"JSON格式响应报文体"
}

/**说明**/
名词解释
1.商品:用户可以购买的物品，例如:A金，B金，A银，ECJia负责添加
2.产品:商品的类别,例如:黄金，白银 ，黄金象后台负责添加，添加后需要在ECJia后台针对每一种商户赋予一个产品属性

单位
1.重量：克 四位小数
2.数量：件
3.金额：元 两位小数
4.单价: 元/克
/**说明**/

/********* 配置存储方案(计算利息) *********/
  url:"/goldbagappapi/product/calInterest",

  发送数据：
  {
    type:1,//1:寄存；2：续存
    productInfo:[//数组可以穿多个值["黄金1","黄金2","黄金3"]   产品名字，通过ECJIa商品标签获取
      {
        "productName": "GA",//2:续存的时候，使用productName
        "schemaCode":"GA",//1:寄存的时候，使用schemaCode
        "weight":50,//总重量
      },
      {
        "productName": "GB",//2:续存的时候，使用productName
        "schemaCode":"GB",//1:寄存的时候，使用schemaCode
        "weight":50,//总重量
      },
      {
        "productName": "SA",//2:续存的时候，使用productName
        "schemaCode":"SA",//1:寄存的时候，使用schemaCode
        "weight":100,//总重量
      },
    ]
  }
  返回数据，正确：
  {
    list:[
      {
        productName:"黄金1",
        schemaCode:"GB",
        minWeight:50,
        items:[
          {
            id:1,
            days:30,//单位天
            interest:0.0001//利息,单位克,四位小数,产品可能要求有些地方显示四位，有些地方显示三位，后台统一返回四位
          },
          {
            id:2,
            days:60,//单位天
            interest:0.3//利息,单位克
          },
          {
            id:3,
            days:90,//单位天
            interest:0.4//利息,单位克
          }
        ]
      },
      {
        productName:"黄金2",
        schemaCode:"GB",
        minWeight:100,
        items:[
          {
            id:1,
            days:30,//单位天
            interest:0.0001//利息,单位克,四位小数,产品可能要求有些地方显示四位，有些地方显示三位，后台统一返回四位
          },
          {
            id:2,
            days:60,//单位天
            interest:0.3//利息,单位克
          },
          {
            id:3,
            days:90,//单位天
            interest:0.4//利息,单位克
          }
        ]
      }
    ],  
  }
/********* 配置存储方案 *********/

/********* 账户信息(利息账户列表) *********/
  url:"/goldbagappapi/interest/list",

  发送数据：
  {}
  返回数据
  {
  	items:[
  		{
  			id:1,
  			productName:"G"，
  			value:0.2523//单位克，四位小数
  		},
  		{
  			id:2,
  			productName:"S",
  			value:5.56//单位克
  		}
  	]
  }
/********* 账户信息(利息账户列表) *********/


/********* 收支明细 *********/
黄金象没有充值提现业务，所以没有收支
/********* 收支明细 *********/


/********* 利息明细（利息流水查询） *********/
  url:"/goldbagappapi/interestFlow/list",

  发送数据：
  {
    // productName:"黄金",
    types:[4,8],
    pageId: 1, //{number} 当前页，page为空返回全部列表
    pageSize: 10 //{number} 每页显示条数
  }
  返回数据
  {
      pageId: 1, //当前页
      pageSize: 10,
      pageSum: 2, //总页数
      pageRecords: 13 //总记录数
      items:[
        {
          type:4,//4：入账,8：出账
          productName:"G",//{string} 
          days:30//单位天	
          value:2,//{number} 利息数值,单位克
          balance:7,//{number} 余额,单位克
          createTime:"2018-10-20 11:11:11"//{string} 创建时间
        },
        {
          type:4,//4：入账,8：出账
          productName:"S",//{string} 
          days:30//单位天	
          value:5,//{number} 利息数值,单位克
          balance:5,//{number} 余额,单位克
          createTime:"2018-10-19 22:22:22"//{string} 创建时间
        }
      ]
  }
/********* 利息明细 *********/

/********* 最新利息（4：入账，8：出账） *********/
  url:"/goldbagappapi/interestFlow/latest",

  发送数据：
  {
    // productName:"黄金",
    type:"4",//4,8
  }
  返回数据
  {
    balance: 0.004
    createTime: "2018-11-25 18:34:10"
    description: "利息入账"
    id: 642
    orderNo: "DP201811251741440056609"
    type: 4
    userId: "18500505301"
    value: 0.001
  }
/********* 最新利息（4：入账，8：出账） *********/

/********* 利息转入账户 *********/
  url:"/goldbagappapi/interest/buyback",

  发送数据：
  {
    productName:"黄金",//{string}
  }
  返回数据：
  {
  	id:1,//订单ID
  	unitPrice:3.5//锁定价格
  }
/********* 利息转入账户 *********/

/********* 利息转入账户（确认） *********/
  url:"/goldbagappapi/interest/buybackConfirm",

  发送数据：
  {
    id:1//回购订单ID
  }
  返回数据：
  {}
/********* 利息转入账户（确认） *********/

/********* 利息转入账户（取消） *********/
  url:"/goldbagappapi/interest/buybackCancel",

  发送数据：
  {
    id:1//回购订单ID
  }
  返回数据：
  {}
/********* 利息转入账户（取消） *********/


/********* 代办列表(给全部不分页了) *********/
  url:"/goldbagappapi/proxy/list",

  发送数据：
  {}
  返回数据：
  {
      items:[
        {
          id:1,//{string} 代存账户ID
          url:"http://",//{string} 产品图标,图片地址
          goodsId:1,//商品ID
          goodsName:"a品牌金",////{string} 商品名称
          productName:"黄金",//产品名称
          spec:50//规格,单位克
          value:5,//{number} 最大数量
        },
        {
          id:2,//{string} 代存账户ID
          url:"http://",//{string} 产品图标,图片地址
          goodsId:2,//商品ID
          goodsName:"b品牌金",////{string} 商品名称
          productName:"黄金",//产品名称
          spec:100//规格,单位克
          value:6,//{number} 最大数量
        },
        {
          id:3,//{string} 代存账户ID
          url:"http://",//{string} 产品图标,图片地址
          goodsId:1,//商品ID
          goodsName:"a品牌银",////{string} 商品名称
          productName:"白银",//产品名称
          spec:200//规格,单位克
          value:10,//{number} 最大数量
        }
      ]
  }
/********* 代办列表(给全部不分页了) *********/

/********* 计算快递费 *********/
  url:"/goldbagappapi/expressFee/calculate",
  发送数据：
  {
  	weigh:100,//重量
  	province:"江苏"//省份
  	city:"南京"//市
  }
  返回数据：
  {
  	value:15//单位元
  }
  
/********* 计算快递费 *********/


/********* 生成提货订单（用户点击去付款后才会生成提货订单） *********/
  url:"/goldbagappapi/delivery/create",

  发送数据：
  {
  	name:"张三",
    address:"上海市",//{string} 收货地址，格式
    province:"上海市"//省份
    city:"上海市"//市
    mobile:"18500505301",//{string} 手机号
    // expressFee:15,//快递费,单位元	
    items:[
      {
      	// productName:"黄金",//产品名称
        goodsId:1,//商品ID
        quantity:4,//{number} 提货数量
        // spec:50//规格
      },
      {
      	// productName:"白银",//产品名称
        goodsId:2,//商品ID
        quantity:3,//{number} 提货数量
        // spec:100//规格
      }
    ]
  }
  返回数据
  {
  	id:1,//订单ID
  }
/********* 生成提货订单 *********/

/********* 提货订单取消(待付款状态的存储订单) *********/
  url:"/goldbagappapi/delivery/cancel"
  发送数据:
  {
  	id:1,//订单ID
  	reason:"其它原因",//原因
  }
  返回数据
  {}
/********* 提货订单取消(待付款状态的存储订单) *********/

/********* 提货订单删除(已完成状态的存储订单) *********/
  url:"/goldbagappapi/delivery/delete"
  发送数据:
  {
  	id:1//订单ID
  }
  返回数据：
  {}
/********* 提货订单删除(已完成状态的存储订单) *********/

/********* 提货订单确认收货 *********/
  url:"/goldbagappapi/delivery/confirm"
  发送数据:
  {
  	id:1//订单ID
  }
  返回数据：
  {}
/********* 提货订单确认收货 *********/

/********* 支付 (此支付接口现在只用来支付代办转提货时产生的快递费)*********/
  url:"/goldbagappapi/fund/pay"

  发送数据
  {
  	id:1,//订单ID
  	channel:"alipay",//支付渠道，支付宝:alipay,微信wechat
  }
  返回数据
  {
  	url:"",//支付地址
  	extension:"{}"//json格式支付参数
  }
/********* 支付 *********/

/********* 生成不出库回购订单*********/
  url:"/goldbagappapi/buyback/create",

  发送数据：
  {
    // productName:"黄金",//{string}产品名称，一次回购只能选择一种产品(可以是多个商品)
    type:2,//固定值2，代表回购商品
    items:[
      {
        goodsId:1,//{string} 商品ID
        quantity:4,//{number} 回购数量
      },
      {
        goodsId:2,//{string} 商品ID
        quantity:3,//{number} 回购数量
      }
    ]
  }
  返回数据，正确：
  {
  	id:1,//订单ID
  	unitPrice:3.5,//锁定价格
    buybackFee:3.0,//回购手续费
  }
/********* 生成不出库回购订单 *********/

/********* 生成不出库回购(确认)*********/
  url:"/goldbagappapi/buyback/confirm",

  发送数据：
  {
    id:1//回购订单ID
  }
  返回数据，正确：
  {}
/********* 生成不出库回购(确认) *********/

/********* 生成不出库回购(取消)*********/
  url:"/goldbagappapi/buyback/cancel",

  发送数据：
  {
    id:1//回购订单ID
  }
  返回数据，正确：
  {}
/********* 生成不出库回购(取消) *********/


/********* 生成存储订单 *********/
  url:"/goldbagappapi/deposit/create",

  发送数据：
  {
    // productName:"G",//{string}产品名称
    schemaId:1,//方案id
    type:1,//1:寄存；2：续存
    items:[
      {
        goodsId:1,//{string} 商品ID
        quantity:4,//{number} 数量
      },
      {
        goodsId:2,//{string} 商品ID
        quantity:3,//{number} 数量
      }
    ]
  }
  返回数据：
  {}
/********* 生成存储订单 *********/


/********* 我的订单列表-提货(存储提货) *********/
  url:"/goldbagappapi/delivery/list",

  发送数据：
  {
    status:1,//{string} 空或不传代表全部，1.待付款2.待发货3.待收货4.已完成5.已取消
    pageId: 1, //{number} 当前页，page为空返回全部列表
    pageSize: 10, //{number} 每页显示条数
  }
  返回数据：
  {
  	pageId: 1, //当前页
    pageSize: 10
    pageSum: 2, //总页数
    pageRecords:13 //总记录数
    items:[
        {
          id:1,//
          userId:"18930188151",//用户ID
          orderNo:"123435",//订单号
          status:1,//1.待付款2.待发货3.待收货4.已完成5.交易关闭（暂时产品要求只有查看全部时才能查到）
          payChannel:"alipay",//支付渠道，支付宝:alipay,微信wechat
          expressFee:15,//快递费
          name:"张三",//收货人姓名
          mobile:"13278514345",//收货人手机号
          address:"上海",//收货人地址
          createTime:"2018-10-21 05:10:29",订单创建时间
          payTime:"2018-12-21 05:11:00",支付时间
          quantity:5,//数量，单位件
          weight:350,//重量,单位克
          details:[//订单内的产品列表
            {
              goodsId:1,//商品ID
              url:"http://",//图片地址
              goodsName:"A金",//商品名称
              quantity:3,//数量
              weight:150//重量
            },
            {
              goodsId:2,//商品ID
              url:"http://",//图片地址
              goodsName:"B金",//商品名称
              quantity:2,//数量
              weight:200//重量
            }
          ],
        },
        {
          id:2,//
          userId:"18930188151",//用户ID
          orderNo:"323232",//订单号
          status:2,//1.待付款2.待发货3.待收货4.已完成5.交易关闭（暂时产品要求只有查看全部时才能查到）
          payChannel:"alipay",//支付渠道，支付宝:alipay,微信wechat
          expressFee:15,//快递费
          name:"张三",//收货人姓名
          mobile:"13278514345",//收货人手机号
          address:"上海",//收货人地址
          createTime:"2018-10-21 05:10:29",订单创建时间
          payTime:"2018-12-21 05:11:00",支付时间
          quantity:5,//数量，单位件
          weight:350,//重量,单位克
          details:[//订单内的产品列表
            {
              goodsId:1,//商品ID
              url:"http://",//图片地址
              goodsName:"A金",//商品名称
              quantity:3,//数量
              weight:150//重量
            },
            {
              goodsId:2,//商品ID
              url:"http://",//图片地址
              goodsName:"B金",//商品名称
              quantity:2,//数量
              weight:200//重量
            }
          ],
        },
    ]
  }
/********* 我的订单列表-提货 *********/

/********* 我的订单列表-存储（寄存订单列表） *********/
  url:"/goldbagappapi/deposit/list",

  发送数据：
  {
    status:1,//{string} 空或不传代表全部，1.存储中 2.已到期 3.提前结束 4.待付款（弃用ecjia） 5.已取消（弃用ecjia） 6.确认中 7.初始化(保留)
    pageId: 1, //{number} 当前页，page为空返回全部列表
    pageSize: 10, //{number} 每页显示条数
  }
  返回数据：
  {
    pageId: 1, //当前页
    pageSize: 10
    pageSum: 2, //总页数
    pageRecords: 13 //总记录数
    items:[
        {
          id:1,//
          userId:"18930188151",//用户ID
          orderNo:"123435",//订单号
          status:1,//1.存储中 2.已到期 4.待付款
          days:30,//寄存天数
          remainDays:12,//剩余天数
          interest:10,//利息，单位克
          willDo:1,//寄存到期后操作，1.代存 2.寄存 3.回购
          createTime:"2018-10-31 15:00:34",//订单创建时间
          calInterestStartTime:"2018-11-01 20:00:00",//计息开始时间
          calInterestStopTime:"2018-11-31 20:00:00",//计息结束时间
          weight:350,//重量,单位克
          rawInfo:{
            formatedAddTime: "2019-04-13 15:55:53",
            orderId: "1004",
            orderSn: "2019041380599G2",
          },
          orderAmount:200,//订单金额
          paidAmount:3000,//实际付款金额
          bonus:200,//优惠券金额
          orderType:1,//1:寄存订单；2:续存订单
          details:[//订单内的产品列表
            {
              goodsId:1,//商品ID
              url:"http://",//图片地址
              goodsName:"A金",//商品名称
              quantity:3,//数量
              weight:150//重量
              rawInfo:{
                formatedAddTime: "2019-04-13 15:55:53",
                orderId: "1004",
                orderSn: "2019041380599G2",
                url:"http://",//图片地址
                goodsPrice:2000,//商品价格
                subsidyPrice:1800//商品补贴之后的价格
              },
            },
            {
              goodsId:2,//商品ID
              url:"http://",//图片地址
              goodsName:"B金",//商品名称
              quantity:2,//数量
              weight:200//重量
              rawInfo:{
                formatedAddTime: "2019-04-13 15:55:53",
                orderId: "1004",
                orderSn: "2019041380599G2",
                url:"http://",//图片地址
                goodsPrice:2000,//商品价格
                subsidyPrice:1800//商品补贴之后的价格
              },
            }
          ],
        },
        {
          id:2,//
          userId:"18930188151",//用户ID
          orderNo:"323223",//订单号
          status:1,//1.存储中 2.已到期 4.待付款
          days:30,//寄存天数
          remainDays:12,//剩余天数
          interest:10,//利息，单位克
          createTime:"2018-10-31 16:00:34",//订单创建时间
          calInterestStartTime:"2018-11-01 20:00:00",//计息开始时间
          calInterestStopTime:"2018-11-31 20:00:00",//计息结束时间
          weight:350,//重量,单位克
          rawInfo:{
            formatedAddTime: "2019-04-13 15:55:53",
            orderId: "1004",
            orderSn: "2019041380599G2",
          }
          orderType:1,//1:寄存订单；2:续存订单
          details:[//订单内的产品列表
            {
              goodsId:1,//商品ID
              url:"http://",//图片地址
              goodsName:"A金",//商品名称
              quantity:3,//数量
              weight:150//重量
              rawInfo:{
                formatedAddTime: "2019-04-13 15:55:53",
                orderId: "1004",
                orderSn: "2019041380599G2",
                url:"http://",//图片地址
                goodsPrice:2000,//商品价格
                subsidyPrice:1800//商品补贴之后的价格
              },
            },
            {
              goodsId:2,//商品ID
              url:"http://",//图片地址
              goodsName:"B金",//商品名称
              quantity:2,//数量
              weight:200//重量
              rawInfo:{
                formatedAddTime: "2019-04-13 15:55:53",
                orderId: "1004",
                orderSn: "2019041380599G2",
                url:"http://",//图片地址
                goodsPrice:2000,//商品价格
                subsidyPrice:1800//商品补贴之后的价格
              },
            }
          ],
        },
    ]
  }
/********* 我的订单列表-存储 *********/

/********* 获取当前订单存储中更改到期后自动设置（数据从寄存订单列表中willdo字段获取） *********/
/********* 获取当前订单存储中更改到期后自动设置 *********/

/********* 保存存储中更改到期后自动设置(寄存订单更新) *********/
 url:"/goldbagappapi/deposit/update",

  发送数据：
  {
    id:1,//订单ID
    willDo:1//寄存到期后操作，1.代存 2.寄存 3.回购
  }
  返回数据：
  {}
/********* 保存存储中更改到期后自动设置 *********/

/********* 我的订单列表-回购(回购订单列表) *********/
  url:"/goldbagappapi/buyback/list",

  发送数据：
  {
    pageId: 1, //{number} 当前页，page为空返回全部列表
    pageSize: 10, //{number} 每页显示条数
    status: 1,//状态1.待确认 2.已确认 3.已取消，不传即全部
    type: 1,//1.利息回购 2.商品回购
  }
  返回数据:
  {
  	pageId: 1, //当前页
    pageSize: 10
    pageSum: 2, //总页数
    pageRecords: 13 //总记录数
    items:[
        {
        	id:1,//订单ID
        	status: 1,//状态1.待确认 2.已确认 3.已取消，不传即全部
        	type: 1,//利息回购 2.商品回购
        	orderNo:"BB32323",//订单号
        	productName:"黄金",//产品名称
        	unitPrice:10,//回购单价，元/克
        	weigh:400//重量
        	createTime:"2018-10-20 20:00:00",//创建时间
        	amount:4000//回购金额
          	details:[//订单内的产品列表
             {
               goodsId:1,//商品ID
               url:"http://",//图片地址
               goodsName:"A金",//商品名称
               quantity:4,//数量
               weight:200//重量
             },
             {
               goodsId:2,//商品ID
               url:"http://",//图片地址
               goodsName:"B金",//商品名称
               quantity:2,//数量
               weight:200//重量
             }
           ],
    	},
    	{
        	id:2,//订单ID
        	orderNo:"BB32324",//订单号
        	productName:"黄金",//产品名称
        	unitPrice:10,//回购单价，元/克
        	weigh:400//重量
        	createTime:"2018-10-21 20:00:00",//创建时间
        	amount:4000//回购金额
          	details:[//订单内的产品列表
             {
               goodsId:1,//商品ID
               url:"http://",//图片地址
               goodsName:"A金",//商品名称
               quantity:4,//数量
               weight:200//重量
             },
             {
               goodsId:2,//商品ID
               url:"http://",//图片地址
               goodsName:"B金",//商品名称
               quantity:2,//数量
               weight:200//重量
             }
           ],
    	},
    ]
  }
/********* 我的订单列表-回购 *********/

/********* 寄存订单详情*********/
  url:"/goldbagappapi/deposit/detail",

  发送数据：
  {
    id:1,//订单ID
  }
  返回数据：
  {
      id:1,//
      userId:"18930188151",//用户ID
      orderNo:"123435",//订单号
      status:1,//1.存储中 2.已到期 4.待付款
      days:30,//寄存天数
      remainDays:12,//剩余天数
      interest:10,//利息，单位克
      willDo:1,//寄存到期后操作，1.代存 2.寄存 3.回购
      createTime:"2018-10-31 15:00:34",//订单创建时间
      calInterestStartTime:"2018-11-01 20:00:00",//计息开始时间
      calInterestStopTime:"2018-11-31 20:00:00",//计息结束时间
      weight:350,//重量,单位克
      rawInfo:{
        formatedAddTime: "2019-04-13 15:55:53",
        orderId: "1004",
        orderSn: "2019041380599G2",
      },
      orderAmount:200,//订单金额
      paidAmount:3000,//实际付款金额
      bonus:200,//优惠券金额
      orderType:1,//1:寄存订单；2:续存订单
      "goodsDetail": {
        "goodsName": "甄汇银平价15g福字贺岁收藏送礼 小银块可回购年年",
        "spec": 15,
        "productName": "S",
        "url": "http://192.168.25.76:10080/content/uploads/images/201811/source_img/1161_G_1542323989546.jpg",
        "ecjOrderId": "219",
        "formated_add_time":"2018-11-19 20:08:56",
      },
      details:[//订单内的产品列表
        {
          goodsId:1,//商品ID
          url:"http://",//图片地址
          goodsName:"A金",//商品名称
          quantity:3,//数量
          weight:150,//重量
          rawInfo:{
            formatedAddTime: "2019-04-13 15:55:53",
            orderId: "1004",
            orderSn: "2019041380599G2",
            total_fee:3500,//订单总金额
            url:"http://",//图片地址
            goodsPrice:2000,//商品价格
            subsidyPrice:1800//商品补贴之后的价格
          },
        },
        {
          goodsId:2,//商品ID
          url:"http://",//图片地址
          goodsName:"B金",//商品名称
          quantity:2,//数量
          weight:200//重量
          rawInfo:{
            formatedAddTime: "2019-04-13 15:55:53",
            orderId: "1004",
            orderSn: "2019041380599G2",
            url:"http://",//图片地址
            goodsPrice:2000,//商品价格
            subsidyPrice:1800//商品补贴之后的价格
          },
        }
      ],
  }
/********* 寄存订单详情 *********/

/********* 提货订单详情*********/
  url:"/goldbagappapi/delivery/detail",

  发送数据：
  {
    id:1//订单ID
  }
  返回数据：
  {
       id:1,//
       userId:"18930188151",//用户ID
       orderNo:"123435",//订单号
       status:1,//1.待付款2.待发货3.待收货4.已完成5.交易关闭（暂时产品要求只有查看全部时才能查到）
       payChannel:"alipay",//支付渠道，支付宝:alipay,微信wechat
       expressFee:15,//快递费
       name:"张三",//收货人姓名
       mobile:"13278514345",//收货人手机号
       address:"上海",//收货人地址
       createTime:"2018-10-21 05:10:29",订单创建时间
       payTime:"2018-12-21 05:11:00",支付时间
       quantity:5,//数量，单位件
       weight:350,//重量,单位克
       details:[//订单内的产品列表
            {
              goodsId:1,//商品ID
              url:"http://",//图片地址
              goodsName:"A金",//商品名称
              quantity:3,//数量
              weight:150//重量
            },
            {
              goodsId:2,//商品ID
              url:"http://",//图片地址
              goodsName:"B金",//商品名称
              quantity:2,//数量
              weight:200//重量
            }
      ]
  }
/********* 提货订单详情 *********/

/********* 回购订单详情*********/
  url:"/goldbagappapi/buyback/detail",

  发送数据：
  {
    id: 1, //订单ID
  }
  返回数据:
  {
        	id:1,//订单ID
        	status: 1,//1.待确认 2.已确认 3.已取消
        	type: 1,//1.利息回购 2.商品回购
        	orderNo:"BB32323",//订单号
        	productName:"黄金",//产品名称
        	unitPrice:10,//回购单价，元/克
        	weigh:400//重量
        	createTime:"2018-10-20 20:00:00",//创建时间
        	amount:4000//回购金额
          	details:[//订单内的产品列表
             {
               goodsId:1,//商品ID
               url:"http://",//图片地址
               goodsName:"A金",//商品名称
               quantity:4,//数量
               weight:200//重量
             },
             {
               goodsId:2,//商品ID
               url:"http://",//图片地址
               goodsName:"B金",//商品名称
               quantity:2,//数量
               weight:200//重量
             }
           ]
  }
/********* 回购订单详情 *********/


/********* 订单返回状态个数*********/
  url:"/goldbagappapi/orderstatus/number",

  发送数据：
  {
  }
  返回数据:
  {
    "deposit":[//存储       1.存储中 2.已到期 3.提前结束 4.待付款 5.已取消（ecjia） 6.确认中 7.初始化(保留)
      {
        "status":6,//6.确认中
        "count":8,//{number} 订单个数
      },
    ],
    "buyback":[//回购       1.待确认 2.已确认 3.已取消
      {
        "status":1,//1.待确认
        "count":2,//{number} 订单个数
      },
    ],
    "delivery":[//存储提货   1.待付款 2.待发货 3.待收货 4.已完成 5.交易关闭
      {
        "status":2,//2.待发货
        "count":3,//{number} 订单个数
      },
      {
        "status":3,//3.待收货
        "count":5,//{number} 订单个数
      },
    ]
  }
/********* 订单返回状态个数 *********/


/************品牌价格获取**************/
  url:"/goldbagappapi/brand/getPrice",
  发送数据:
  {
    productName:"G",
  }
  返回数据:
  {
    items:[
      {
        brandName:"中国黄金",//品牌名称
        list:[
          {
            productName:"G",//产品名称
            commodityTypeName:"理财金",
            price:"285"
          },
          {
            productName:"G",//产品名称
            commodityTypeName:"工艺金",
            price:"289"
          },
        ]
      },
      {
        brandName:"周生生",//品牌名称
        list:[
          {
            productName:"G",//产品名称
            commodityTypeName:"周生生理财金",
            price:"285"
          },
          {
            productName:"G",//产品名称
            commodityTypeName:"周生生工艺金",
            price:"289"
          },
        ]
      },
    ]
  }
/************品牌价格获取***************/


/************今日金价获取**************/
  url:"/goldbagappapi/product/getUnitPrice", 
  发送数据:
  {
    productName:"G"
  }
  返回数据:
  {
    productName:"G",//产品名称
    productTitle:"黄金",
    price:"285"//价格
  }
/************今日金价获取**************/




/************存金送金快速购买---获取产品利息方案**************/
  url:"/goldbagappapi/product/getInterestSchema", 
  发送数据:
  {
    name:"G",
    schemaCode:"GA",//方案编码
    type:1,//1:寄存；2：续存
  }
  返回数据:
  {
    name:"G",//产品名称
    schemaCode:"GA",//方案编码
    deposit:10,//寄存标准
    unitPrice:285,//市场价格
    
    items:[
        {
          id:1,//方案id
          days:30,//天数
          rate:0.001,//利率
          status:1//状态 0.禁用,1.启用
        },
        {
          id:2,//方案id
          days:90,//天数
          rate:0.002,//利率
          status:1//状态 0.禁用,1.启用
        },
        {
          id:3,//方案id
          days:180,//天数
          rate:0.003,//利率
          status:1//状态 0.禁用,1.启用
        },
        {
          id:4,//方案id
          days:360,//天数
          rate:0.004,//利率
          status:1//状态 0.禁用,1.启用
        },
      ]
  }
/************存金送金快速购买---获取产品利息方案**************/

/************存金送金快速购买---获取订单预计到期时间**************/
  url:"/goldbagappapi/order/expectFinishDate", 
  发送数据:
  {
    days:30//寄存天数
  }
  返回数据:
  {
    expectFinishDate:"2018-12-12"//预计到期日期
  }
/************存金送金快速购买---获取订单预计到期时间**************/




/********* 我的消息 (使用websoket推送，具体内容待定)*********/
/********* 我的消息 （使用websoket推送，具体内容待定）*********/

/********* 当前金属价格(使用websoket推送，具体内容待定) *********/
/********* 当前金属价格(使用websoket推送，具体内容待定) *********/



/***********************获取最新渠道版本信息***************************/
  url:"/goldbagappapi/getChannelVersionInfo", 
  发送数据：
  {
    projectCode:"001",//{string}项目编码
    channelCode:"001",//{string} 渠道编码
    appVersion: version_code
  }
  返回数据，正确：
  {
    "errorCode": 0,
    "errorMessage": "成功",
    "model": {
      projectCode:"001",//{string}项目编码
      channelCode:"001",//{string} 渠道编码
      appVersion:"1.0.0",//{string} app版本（最新审核通过渠道版本信息）
      versionDescribe:"提供网络状态"//{string} 版本说明
      updateStrategy:0,//更新策略 1：提醒更新，2：强制更新，3：静默
      updateUrl:"http://update.goldrock.cn/010101/2.4.0.apk",//更新ur
      findNewVersion:true,//是否发现新版本
      status:1，//{number}1：待审核2：审核中，3.审核通过，4.审核不通过 当前版本状态
    }
  }
  返回数据，错误：
  {
    "errorCode": -1,//非0数字
    "errorMessage": "后台传过来的错误信息",
    "model": ""
  }
/***********************获取最新渠道版本信息**************************/


/************历史价格获取**************/
  url:"/goldbagappapi/product/getHistoryPrice", 
  发送数据:
  {
    productName:"G",
    days:"7",//{string} reauired 如果是"7"这种数字，表示最近7天的数据；和date两个参数取其一
    date:"2018-07-01~2018-07-09",//{string} optional 如果是"2018-07-01~2018-07-09"这种时间段，表示一个时间段的数据，和days两个参数取其一
  }
  返回数据:
  {
      items:[
        {
          date:"2018-10-19",
          price:300.00
        },
        {
          date:"2018-10-20",
          price:301.00
        },
        {
          date:"2018-10-21",
          price:302.00
        },
        {
          date:"2018-10-22",
          price:296.10
        },
        {
          date:"2018-10-23",
          price:302.80
        },
        {
          date:"2018-10-24",
          price:298.00
        },
        {
          date:"2018-10-25",
          price:305.50
        },
     ]
  }
/************历史价格获取**************/


/*************************************后台系统接口*************************************/