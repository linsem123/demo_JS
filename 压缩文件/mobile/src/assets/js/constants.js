//验证用的正则
module.exports.FORM_REG = {
  "invitation_code": '^[0-9a-zA-Z]+$',
  "name": '^.+$',
  "idno": '^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X|x)$',
  "phone": '^1[23456789]\\d{9}$',
  "captcha": '^.+$',
  "captcha_image":'^.+$',
  "card_number": '^\\d+$', //'^[0-9]+$',
  "password": '^.+$',
  "password6": '^.{6}$',
  "confirm_password6":'^.{6}$',
  "password6_12": '^.{6,12}$',
  "fundpwd": '^[0-9]{6}$',
  "pwd": '^[0-9a-zA-Z]{6,12}$',
  "money": '^([1-9]\\d{0,7})$|^([1-9][0-9]{0,7}\\.\\d{1,2})$|^(0\\.[1-9][0-9]?)$|^(0\\.[0-9][1-9])$',
  "buy_money": '^([1-9]\\d{0,7})$|^([1-9][0-9]{0,7}\\.\\d{1,2})$|^(0\\.[1-9][0-9]*)$|^(0\\.[0-9][1-9])$',
  "apply_weight": '^[1-9]\\d*$',
  "apply_weight_interest": '^([1-9]\\d*)$|^([1-9][0-9]*\\.\\d{1,2})$|^(0\\.[1-9][0-9]*)$|^(0\\.[0-9][1-9])$',

  "consignee":'^.+$',
  "mobile": '^1[23456789]\\d{9}$',
  "address_head_info":'^.+$',
  "address_detail":'^.+$',
  "branch":'^.+$',
}

module.exports.UNIT_TYPE_TEXT = {
  "1":"金额",
  "2":"克重",
}

module.exports.OPERATION_TEXT = {
  "1":"小于",
  "2":"等于",
  "3":"大于",
}

module.exports.METAL_TYPE = {
  "G":"金",
  "S":"银"
}

module.exports.COUPON_TEXT = {
  "4":"注册券",//注册送红包
  "5":"优惠券",//优惠券
  "6":"邀请券",//推荐注册并消费送优惠券
}

module.exports.COUPON_TYPE_LABEL = {
  "0":"限金条产品使用",
  "1":"仅用于黄金理财加息",
  "2":"仅用于购买实物金条",
}


module.exports.order_type_status = [
  {
    typeId: 1,
    typeName: "金条/饰品",//即时提货
    status: [
      {
        statusKey: "all",//ecjia的全部订单用all表示
        statusName: "全部",
        canFilter: true
      },
      {
        statusKey: "await_pay",
        statusName: "待付款",
        canFilter: true
      },
      {
        statusKey: "await_ship",
        statusName: "待发货",
        canFilter: true
      },
      {
        statusKey: "shipped",
        statusName: "待收货",
        canFilter: true
      },
      {
        statusKey: "finished",
        statusName: "已完成",
        canFilter: true
      },
      {
        statusKey: "canceled",
        statusName: "已取消",
        canFilter: true
      }
    ]
  },
  {
    typeId: 2,
    typeName: "买入",//存储
    status: [
      {
        statusKey: "-1",//非ecjia的全部订单用-1表示
        statusName: "全部订单",
        canFilter: true
      },
      {
        statusKey: "await_pay",
        statusName: "待付款",
        canFilter: true,
      },
      {
        statusKey: "6",
        statusName: "确认中",
        canFilter: true,
      },
      {
        statusKey: "1",
        statusName: "存储中",
        canFilter: true,
      },
      {
        statusKey: "2",
        statusName: "已到期",
        canFilter: true,
      },
      {
        statusKey: "3",//目前还没启用的状态
        statusName: "提前结束",
        canFilter: false,
      },
      {
        statusKey: "canceled",
        statusName: "已取消",
        canFilter: true,
      },
    ]
  },
  {
    typeId: 3,
    typeName: "卖出",//回购
    status:[
      {
        statusKey: "-1",//非ecjia的全部订单用-1表示
        statusName: "全部订单",
        canFilter: true,
      },
      {
        statusKey: "1",
        statusName: "待确认",
        canFilter: true,
      },
      {
        statusKey: "2",
        statusName: "已完成",
        canFilter: true,
      },
      {
        statusKey: "3",
        statusName: "已取消",
        canFilter: true,
      }
    ]
  },
  {
    typeId: 4,
    typeName: "到期提金",//存储提货
    status: [
      {
        statusKey: "-1",//非ecjia的全部订单用-1表示
        statusName: "全部订单",
        canFilter: true,
      },
      {
        statusKey: "1",//目前还没有启用的状态
        statusName: "待付款",
        canFilter: false,
      },
      {
        statusKey: "2",
        statusName: "待发货",
        canFilter: true,
      },
      {
        statusKey: "3",
        statusName: "待收货",
        canFilter: true,
      },
      {
        statusKey: "4",
        statusName: "已完成",
        canFilter: true,
      },
      {
        statusKey: "5",
        statusName: "已取消",
        canFilter: true,
      }
    ]
  }
];