import appconfig from "@/config/appconfig.js";

var API = {
/*--------------------- cms接口 ---------------------*/
  /********* 首页 cms 广告位*********/
  home_advertisements: {
    url: "/cmsservice/advertisements/home?_format=json"
  },
  /********* 首页 cms 广告位**********/

  /********* 买金 cms 广告位*********/
  mall_advertisements: {
    url: "/cmsservice/advertisements/mall?_format=json"
  },
  /********* 买金 cms 广告位**********/

  /********* 饰品 cms 广告位*********/
  accessory_advertisements: {
    url: "/cmsservice/advertisements/accessory?_format=json"
  },
  /********* 饰品 cms 广告位**********/

  /********* 首页 cms 黄金攻略*********/
  articals_category_hjgl: {
    url: "/cmsservice/articals/category/hjgl?_format=json"
  },
  /********* 首页 cms 黄金攻略**********/

  /********* 首页 cms 保养收藏*********/
  articals_category_bysc: {
    url: "/cmsservice/articals/category/bysc?_format=json"
  },
  /********* 首页 cms 保养收藏**********/

  /********* 首页 cms 福利中心*********/
  articals_category_flzx: {
    url: "/cmsservice/articals/category/flzx?_format=json"
  },
  /********* 首页 cms 福利中心**********/

  /********* 首页 cms 安全保障*********/
  articals_category_aqbz: {
    url: "/cmsservice/articals/category/aqbz?_format=json"
  },
  /********* 首页 cms 安全保障**********/

  /********* 首页 cms 金银资讯*********/
  articals_category_jyzx: {
    url: "/cmsservice/articals/category/jyzx?_format=json"
  },
  /********* 首页 cms 金银资讯**********/

  /********* 首页 cms node详情*********/
  cmsservice_node: {
    url: "/cmsservice/node/[filter]?_format=json"
  },
  /********* 首页 cms node详情**********/

  /********* 常见问题分类*********/
  cmsservice_tags_qa: {
    url: "/cmsservice/tags/qa?_format=json"
  },
  /********* 常见问题分类**********/

  /********* 常见问题列表*********/
  cmsservice_qa_list: {
    url: "/cmsservice/qa/[filter]?_format=json"
  },
  /********* 常见问题列表**********/

  /********* 获取邀请列表**********/
  cmsservice_invite_record: {
    url: "/cmsservice/activity/invite_record?_format=json"
  },
  /********* 获取邀请列表**********/

  /********* 饰品 *********/
  accessory: {
    url: "/cmsservice/advertisements/home?_format=json"
  },
  /********* 饰品 **********/


  /********* 获取首页公告 *********/
  cmsservice_notice: {
    url: "/cmsservice/notice?_format=json"
  },
  /********* 获取首页公告 **********/

  /********* 获取注册协议 *********/
  cmsservice_contract_register: {
    url: "/cmsservice/contract/register?_format=json"
  },
  /********* 获取注册协议 **********/

  /********* 获取存储协议 *********/
  cmsservice_contract_storage: {
    url: "/cmsservice/contract/storage?_format=json"
  },
  /********* 获取存储协议 **********/

  /********* 获取回购协议 *********/
  cmsservice_contract_buyback: {
    url: "/cmsservice/contract/buyback?_format=json"
  },
  /********* 获取回购协议 **********/


  /********* 获取回购协议 *********/
  cmsservice_news: {
    url: "/cmsservice/news?_format=json"
  },
  /********* 获取回购协议 **********/
  
/*--------------------- cms接口 ---------------------*/




/*--------------------- 后台 接口 ---------------------*/
  /*********获取配置存储方案(计算利息)*********/
  product_calInterest: {
    url: "/goldbagappapi/product/calInterest",
    test: "/mockapi/product/calInterest"
  },
  /*********获取配置存储方案(计算利息)*********/

  /*********代办列表(给全部不分页了)*********/
  todo_list: {
    url: "/goldbagappapi/proxy/list",
    test: "/mockapi/proxy/list"
  },
  /*********代办列表(给全部不分页了)*********/

  /*********生成存储订单*********/
  deposit_create: {
    url: "/goldbagappapi/deposit/create",
    test: "/mockapi/deposit/create"
  },
  /*********生成存储订单*********/

 /*********存储订单详情*********/
  deposit_detail: {
    url: "/goldbagappapi/deposit/detail",
    test: "/mockapi/deposit/detail"
  },
  /*********存储订单详情*********/

  /********* 获取存储订单列表 *********/
  deposit_list: {
    url: "/goldbagappapi/deposit/list",
    test: "/mockapi/deposit/list"
  },
  /********* 获取存储订单列表 **********/

  /********* 保存存储中更改到期后自动设置 *********/
  deposit_update: {
    url: "/goldbagappapi/deposit/update",
    test: "/mockapi/deposit/update"
  },
  /********* 保存存储中更改到期后自动设置 **********/

  /*********生成不出库回购订单*********/
  buyback_create: {
    url: "/goldbagappapi/buyback/create",
    test: "/mockapi/buyback/create"
  },
  /*********生成不出库回购订单*********/

  /*********回购订单详情*********/
  buyback_detail: {
    url: "/goldbagappapi/buyback/detail",
    test: "/mockapi/buyback/detail"
  },
  /*********回购订单详情*********/

  /*********不出库回购(确认)*********/
  buyback_confirm: {
    url: "/goldbagappapi/buyback/confirm",
    test: "/mockapi/buyback/confirm"
  },
  /*********不出库回购(确认)*********/

  /*********不出库回购(取消)*********/
  buyback_cancel: {
    url: "/goldbagappapi/buyback/cancel",
    test: "/mockapi/buyback/cancel"
  },
  /*********不出库回购(取消)*********/


  /********* 获取回购订单列表 *********/
  buyback_list: {
    url: "/goldbagappapi/buyback/list",
    test: "/mockapi/buyback/list"
  },
  /********* 获取回购订单列表 **********/

  /*********生成提货订单（用户点击去付款后才会生成提货订单）*********/
  delivery_create: {
    url: "/goldbagappapi/delivery/create",
    test: "/mockapi/delivery/create"
  },
  /*********生成提货订单（用户点击去付款后才会生成提货订单）*********/

  /********* 获取存储提货订单列表 *********/
  delivery_list: {
    url: "/goldbagappapi/delivery/list",
    test: "/mockapi/delivery/list"
  },
  /********* 获取存储提货订单列表 **********/

  /*********提货订单取消(待付款状态的存储订单)*********/
  delivery_cancel: {
    url: "/goldbagappapi/delivery/cancel",
    test: "/mockapi/delivery/cancel"
  },
  /*********提货订单取消(待付款状态的存储订单)*********/

  /*********提货订单取消(待付款状态的存储订单)*********/
  delivery_confirm: {
    url: "/goldbagappapi/delivery/confirm",
    test: "/mockapi/delivery/confirm"
  },
  /*********提货订单取消(待付款状态的存储订单)*********/

  /*********提货订单详情*********/
  delivery_detail: {
    url: "/goldbagappapi/delivery/detail",
    test: "/mockapi/delivery/detail"
  },
  /*********提货订单详情*********/

  /*********账户信息(利息账户列表)*********/
  interest_list: {
    url: "/goldbagappapi/interest/list",
    test: "/mockapi/interest/list"
  },
  /*********账户信息(利息账户列表)*********/

  /*********利息转入账户*********/
  interest_buyback: {
    url: "/goldbagappapi/interest/buyback",
    test: "/mockapi/interest/buyback"
  },
  /*********利息转入账户*********/
  
  /*********利息明细（利息流水查询）*********/
  interestFlow_list: {
    url: "/goldbagappapi/interestFlow/list",
    test: "/mockapi/interestFlow/list"
  },
  /*********利息明细（利息流水查询）*********/

  /*********最新利息（4：入账，8：出账）*********/
  interestFlow_latest: {
    url: "/goldbagappapi/interestFlow/latest",
    test: "/mockapi/interestFlow/latest"
  },
  /*********最新利息（4：入账，8：出账）*********/

  /*********计算快递费*********/
  expressfee_calculate: {
    url: "/goldbagappapi/expressFee/calculate",
    test: "/mockapi/expressFee/calculate"
  },
  /*********计算快递费*********/

  /*********支付 (此支付接口现在只用来支付代办转提货时产生的快递费)*********/
  fund_pay: {
    url: "/goldbagappapi/fund/pay",
    test: "/mockapi/fund/pay"
  },
  /*********支付 (此支付接口现在只用来支付代办转提货时产生的快递费)*********/

  /*********订单后台返回状态个数*********/
  orderstatus_number: {
    url: "/goldbagappapi/orderstatus/number",
    test: "/mockapi/orderstatus/number"
  },
  /*********订单后台返回状态个数*********/

  /************今日金价获取**************/
  product_getUnitPrice: {
    url: "/goldbagappapi/product/getUnitPrice",
    test: "/mockapi/product/product"
  },
  /************今日金价获取**************/

  /************品牌价格获取**************/
  brand_getPrice: {
    url: "/goldbagappapi/brand/getPrice",
    test: "/mockapi/product/product"
  },
  /************品牌价格获取**************/

  /************存金送金快速购买---获取产品利息方案**************/
  product_getInterestSchema: {
    url: "/goldbagappapi/product/getInterestSchema",
    test: "/mockapi/product/getInterestSchema"
  },
  /************存金送金快速购买---获取产品利息方案**************/

  /************存金送金快速购买---获取产品利息方案**************/
  order_expectFinishDate: {
    url: "/goldbagappapi/order/expectFinishDate",
    test: "/mockapi/order/expectFinishDate"
  },
  /************存金送金快速购买---获取产品利息方案**************/


  /************获取历史价格趋势**************/
  product_getHistoryPrice: {
    url: "/goldbagappapi/product/getHistoryPrice",
    test: "/mockapi/product/getHistoryPrice"
  },
  /************获取历史价格趋势**************/

  
/*--------------------- 后台 接口 ---------------------*/






/*--------------------- 商城接口 ---------------------*/
  /********* 商城获取店铺商品分类 *********/
  merchant_goods_category: {
    url: "/sites/api/?url=merchant/goods/category"
  },
  /********* 商城获取店铺商品分类 **********/

  /********* 获取某个商家商品推荐列表，如：新品，精品，热销等 *********/
  merchant_goods_suggestlist: {
    url: "/sites/api/?url=merchant/goods/suggestlist"
  },
  /********* 获取某个商家商品推荐列表，如：新品，精品，热销等 **********/

  /********* 获取店铺街店铺商品列表 *********/
  merchant_goods_list: {
    url: "/sites/api/?url=merchant/goods/list"
  },
  /********* 获取店铺街店铺商品列表 **********/

  /********* 获取单个商品的信息 *********/
  goods_detail: {
    url: "/sites/api/?url=goods/detail"
  },
  /********* 获取单个商品的信息 **********/

  /********* 获取单个商品的详情描述 *********/
  goods_desc: {
    url: "/sites/api/?url=goods/desc"
  },
  /********* 获取单个商品的详情描述 **********/

  /********* 商城用户注册 *********/
  user_signup: {
    url: "/sites/api/?url=user/signup"
  },
  /********* 商城用户注册 **********/


  /********* mall获取access token *********/
  access_token: {
    url: "/sites/api/?url=shop/token"
  },
  /********* mall获取access token **********/

  /********* mall获取图形验证码 *********/
  captcha_image: {
    url: "/sites/api/?url=captcha/image"
  },
  /********* mall获取图形验证码 **********/

  
  /********* mall用户关联注册，手机/邮箱等发送验证码 *********/
  user_userbind: {
    url: "/sites/api/?url=user/userbind"
  },
  /********* mall用户关联注册，手机/邮箱等发送验证码 **********/


  /********* mall用户账户关联注册（手机、邮箱等），校验验证码 *********/
  validate_bind: {
    url: "/sites/api/?url=validate/bind"
  },
  /********* mall用户账户关联注册（手机、邮箱等），校验验证码 **********/


  /********* 商城用户登录 *********/
  user_signin: {
    url: "/sites/api/?url=user/signin"
  },
  /********* 商城用户登录 **********/

  /********* 商城修改会员登录密码 *********/
  user_password: {
    url: "/sites/api/?url=user/password"
  },
  /********* 商城修改会员登录密码 **********/

  /********* 商城用户关联注册 *********/
  connect_signup: {
    url: "/sites/api/?url=connect/signup"
  },
  /********* 商城用户关联注册 **********/

  /********* 商城用户登出 *********/
  user_signout: {
    url: "/sites/api/?url=user/signout"
  },
  /********* 商城用户登出 **********/


  /********* 商城用户登录 *********/
  connect_signin: {
    url: "/sites/api/?url=connect/signin"
  },
  /********* 商城用户登录 **********/

  /********* 获取用户收货地址列表 *********/
  address_list: {
    url: "/sites/api/?url=address/list"
  },
  /********* 获取用户收货地址列表 **********/

  /********* 获取店铺地区列表信息 *********/
  shop_region: {
    url: "/sites/api/?url=shop/region"
  },
  /********* 获取店铺地区列表信息 **********/

  /********* 添加用户收货地址信息 *********/
  address_add: {
    url: "/sites/api/?url=address/add"
  },
  /********* 添加用户收货地址信息 **********/

  /********* 编辑用户收货地址信息 *********/
  address_update: {
    url: "/sites/api/?url=address/update"
  },
  /********* 编辑用户收货地址信息 **********/

  /********* 删除收货地址 *********/
  address_delete: {
    url: "/sites/api/?url=address/delete"
  },
  /********* 删除收货地址 **********/

  /********* 设置用户收货默认地址 *********/
  address_setDefault: {
    url: "/sites/api/?url=address/setDefault"
  },
  /********* 设置用户收货默认地址 **********/

  /********* 获取用户收货地址的详细信息 *********/
  address_info: {
    url: "/sites/api/?url=address/info"
  },
  /********* 获取用户收货地址的详细信息 **********/

  /********* app店铺支持的支付方式 *********/
  shop_payment: {
    url: "/sites/api/?url=shop/payment"
  },
  /********* app店铺支持的支付方式 **********/

  /********* 添加商品到购物车 *********/
  cart_create: {
    url: "/sites/api/?url=cart/create"
  },
  /********* 添加商品到购物车 **********/

  /********* 更新商品数量 *********/
  cart_update: {
    url: "/sites/api/?url=cart/update"
  },
  /********* 添加商品到购物车 **********/

  /********* 更新商品数量 *********/
  cart_delete: {
    url: "/sites/api/?url=cart/delete"
  },
  /********* 添加商品到购物车 **********/

  /********* 修改购物车商品选中状态 *********/
  cart_checked: {
    url: "/sites/api/?url=cart/checked"
  },
  /********* 修改购物车商品选中状态 **********/


  /*********  购物车列表页 *********/
  cart_list: {
    url: "/sites/api/?url=cart/list"
  },
  /********* 修改购物车商品选中状态 **********/

  /********* 检查购物流订单 *********/
  flow_checkOrder: {
    url: "/sites/api/?url=flow/checkOrder"
  },
  /********* 检查购物流订单 **********/

  /********* 购物流完成生成订单 *********/
  flow_done: {
    url: "/sites/api/?url=flow/done"
  },
  /********* 购物流完成生成订单 **********/

  /********* 订单支付 *********/
  order_update: {
    url: "/sites/api/?url=order/update"
  },
  /********* 订单支付 **********/

  /********* 订单支付 *********/
  order_pay: {
    url: "/sites/api/?url=order/pay"
  },
  /********* 订单支付 **********/

  /********* 获取即时提货订单列表 *********/
  order_list: {
    url: "/sites/api/?url=order/list"
  },
  /********* 获取即时提货订单列表 **********/

  /********* 获取订单详情 *********/
  order_detail: {
    url: "/sites/api/?url=order/detail"
  },
  /********* 获取订单详情 **********/

  /********* 取消订单 *********/
  order_cancel: {
    url: "/sites/api/?url=order/cancel"
  },
  /********* 取消订单 **********/

  /********* 订单确认 *********/
  order_affirmReceived: {
    url: "/sites/api/?url=order/affirmReceived"
  },
  /********* 订单确认 **********/

  /********* 获取订单物流信息 *********/
  order_express: {
    url: "/sites/api/?url=order/express"
  },
  /********* 获取订单物流信息 **********/

  /********* 获取用户信息 *********/
  user_info: {
    url: "/sites/api/?url=user/info"
  },
  /********* 获取用户信息 **********/


  /********* 会员充值申请 *********/
  user_account_deposit: {
    url: "/sites/api/?url=user/account/deposit"
  },
  /********* 会员充值申请 **********/

  /********* 会员充值申请 *********/
  user_collect_list: {
    url: "/sites/api/?url=user/collect/list"
  },
  /********* 会员充值申请 **********/

  /********* 会员充值付款 *********/
  user_account_pay: {
    url: "/sites/api/?url=user/account/pay"
  },
  /********* 会员充值付款 **********/

  /********* 用户余额提现申请 *********/
  // user_account_raply: {
  //   url: "/sites/api/?url=user/account/raply"
  // },
  /********* 用户余额提现申请 **********/

  
  /********* 获取用户充值、提现申请记录 *********/
  user_account_record: {
    url: "/sites/api/?url=user/account/record",
    test: "/mockapi/sites/api/user/account/record",
  },
  /********* 获取用户充值、提现申请记录 **********/


  /********* 当客户忘记帐号密码时，可按手机号、邮箱等进行找回登录密码 *********/
  user_forget_password: {
    url: "/sites/api/?url=user/forget_password"
  },
  /********* 当客户忘记帐号密码时，可按手机号、邮箱等进行找回登录密码 **********/

  /********* 当客户忘记帐号密码时，验证手机或邮箱获取到的校验码进行验证 *********/
  validate_forget_password: {
    url: "/sites/api/?url=validate/forget_password"
  },
  /********* 当客户忘记帐号密码时，验证手机或邮箱获取到的校验码进行验证 **********/

  /********* 用户找回密码重置密码 *********/
  user_reset_password: {
    url: "/sites/api/?url=user/reset_password"
  },
  /********* 用户找回密码重置密码 **********/


  /********* 获取我的邀请奖励记录**********/
  invite_reward: {
    url: "/sites/api/?url=invite/record"
  },
  /********* 获取我的邀请奖励记录**********/

  /********* 获取邀请信息**********/
  invite_user: {
    url: "/sites/api/?url=invite/user"
  },
  /********* 获取邀请信息**********/
  

  /********* 获取商品评论 **********/
  goods_comments: {
    url: "/sites/api/?url=goods/comments"
  },
  /********* 获取商品评论 **********/

  /********* 收藏商品 **********/
  user_collect_create: {
    url: "/sites/api/?url=user/collect/create"
  },
  /********* 收藏商品 **********/

  /********* 删除收藏的商品 **********/
  user_collect_delete: {
    url: "/sites/api/?url=user/collect/delete"
  },
  /********* 删除收藏的商品 **********/

  /********* 订单评论 **********/
  orders_comment: {
    url: "/sites/api/?url=orders/comment"
  },
  /********* 订单评论 **********/



  // ----------商城后台二次开发接口---------- //
    /********* 用户购买商品后，对商品进行评论 **********/
    comment_add: {
      url: "/sites/api/?url=goldbag/comment/add"
    },
    /********* 用户购买商品后，对商品进行评论 **********/


    /********* 即时提货、存储 各种订单状态数量 *********/
    order_count: {
      url: "/sites/api/?url=goldbag/order/count",
      test: "/mockapi/goldbag/order/count"
    },
    /********* 即时提货、存储 各种订单状态数量 **********/

    /********* 存金送金商品列表 *********/
    goods_storageList: {
      url: "/sites/api/?url=goldbag/goods/storageList",
    },
    /********* 存金送金商品列表 **********/

    /********* 添加商品到临时购物车 *********/
    cart_createtemporary: {
      url: "/sites/api/?url=goldbag/cart/createTemporary",
    },
    /********* 添加商品到临时购物车 **********/

    /********* 我的优惠券列表 *********/
    bonus_list: {
      url: "/sites/api/?url=goldbag/bonus/list",
      test: "/mockapi/goldbag/bonus/list"
    },
    /********* 我的优惠券列表 **********/


    /********* 获取优惠活动详情**********/
    favourable_list: {
      url: "/sites/api/?url=goldbag/favourable/list"
    },
    /********* 获取优惠活动详情**********/

    
    /********* 获取我的邀请记录**********/
    invite_record: {
      url: "/sites/api/?url=goldbag/invite/recordList"
    },
    /********* 获取我的邀请记录**********/

    /********* 获取后台品牌信息列表 **********/
    goldbag_goods_brand: {
      url: "/sites/api/?url=goldbag/goods/brand"
    },
    /********* 获取后台品牌信息列表 **********/

    /********* 推荐商品列表 **********/
    goldbag_recommend_list: {
      url: "/sites/api/?url=goldbag/recommend/list"
    },
    /********* 推荐商品列表 **********/

    /********* 校验能否加入购物车 **********/
    goldbag_cart_validate: {
      url: "/sites/api/?url=goldbag/cart/validate"
    },
    /********* 校验能否加入购物车 **********/

    /********* 用户的银行信息 **********/
    goldbag_user_account_bankinfo: {
      url: "/sites/api/?url=goldbag/user/account/bank_info"
    },
    /********* 用户的银行信息 **********/

    /********* 用户余额提现申请 *********/
    goldbag_user_account_raply: {
      url: "/sites/api/?url=goldbag/user/account/raply"
    },
    /********* 用户余额提现申请 **********/

    /********* 银行卡支行信息 **********/
    // goldbag_user_account_branchlist: {
    //   url: "/sites/api/?url=goldbag/user/account/branch_list"
    // },
    /********* 银行卡支行信息 **********/


    /********* 添加购物车物品（增量） *********/
    goldbag_cart_add: {
      url: "/sites/api/?url=goldbag/cart/add"
    },
    /********* 添加购物车物品（增量） **********/

     
  // ----------商城后台二次开发接口---------- //
  

/*--------------------- 商城接口 ---------------------*/
  

/*--------------------- 渠道接口 ---------------------*/
  /********* 获取渠道状态 **********/
  appapi_get_status: {
    url: "/appapi/getStatus"
  },
  /********* 获取渠道状态 **********/


  /********* 获取最新审核通过渠道版本信息 **********/
  get_channel_version_info: {
    url: "/appapi/getChannelVersionInfo"
  },
  /********* 获取最新审核通过渠道版本信息 **********/

/*--------------------- 渠道接口 ---------------------*/


/*--------------------- 数据统计 ---------------------*/
  /********* 获取cookie **********/
  get_cookie: {
    url: "/metis/get/cookie"
  },
  /********* 获取cookie **********/

  /********* 推送统计事件 **********/
  put_event: {
    url: "/metis/put/event"
  },
  /********* 推送统计事件 **********/
/*--------------------- 数据统计 ---------------------*/
};

for (var api in API) {

  if (appconfig.debug == true) {
  } else {
    API[api].url = appconfig.appbaseurl + API[api].url;
  }
  // API[api].url = API[api].test?API[api].test:API[api].url;
}

module.exports = API;
