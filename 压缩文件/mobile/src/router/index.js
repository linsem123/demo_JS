import Vue from "vue";
import Router from "vue-router";

const Home = () => import("@/views/Home.vue"); //商城

const Login = () => import("@/views/Login.vue");



// const RegisterIndex = () => import("@/views/register/Index.vue");

const ResetLoginPassword = () => import("@/views/ResetLoginPassword.vue");
// const ResetTradePassword = () => import("@/views/ResetTradePassword.vue");

const GoodsCategory = () => import("@/views/goods/Category.vue"); //商城分类
const GoodsDetail = () => import("@/views/goods/Detail.vue"); //商城商品详情

// const HelpWxPublic = () => import("@/views/help/WxPublic.vue"); //商城公众号
const GuestService = () => import("@/views/help/GuestService.vue"); //我的客服

const Accessory = () => import("@/views/Accessory.vue"); //商城饰品

// const MyIndex = () => import("@/views/my/Index.vue");
const MyHome = () => import("@/views/my/MyHome.vue");
const MyOrders = () => import("@/views/orders/OrdersList.vue"); //我的订单列表

const MyOrder = () => import("@/views/orders/Order.vue"); //商城订单详情
const MyBuybackOrder = () => import("@/views/orders/BuybackOrder.vue"); //回购订单详情
const MyDeliveryOrder = () => import("@/views/orders/DeliveryOrder.vue"); //存储提货订单详情
const MyDepositOrder = () => import("@/views/orders/DepositOrder.vue"); //存储订单详情

const MyAccount = () => import("@/views/my/Account.vue"); //商城我的账户
const MyBalance = () => import("@/views/my/Balance.vue"); //商城我的收支明细
// const MyInterest = () => import("@/views/my/Interest.vue"); //商城我的利息（赠送克重）明细
const MyRecharge = () => import("@/views/my/Recharge.vue"); //商城我的充值
const MyWithdraw = () => import("@/views/my/Withdraw.vue"); //商城我的提现
const MyCoupon = () => import("@/views/my/Coupon.vue"); //我的优惠券

const MyCollection = () => import("@/views/my/Collection.vue"); //我的收藏
const MyCommentsCenter = () => import("@/views/my/CommentsCenter.vue"); //我的评论
const MyCommentsDetail = () => import("@/views/my/CommentsDetail.vue"); //评论详情


const MyAddresses = () => import("@/views/my/Addresses.vue"); //我的地址
// const MyAddress = () => import("@/views/my/Address.vue"); //我的地址
const MyAddressAdd = () => import("@/views/my/AddressAdd.vue"); //我的地址
const MyAddressEdit = () => import("@/views/my/AddressEdit.vue"); //我的地址

const MySystemSettings = () => import("@/views/my/SystemSettings.vue");
const MySecurityCenter = () => import("@/views/my/MySecurityCenter.vue");
const AboutUs = () => import("@/views/my/AboutUs.vue");


const OrderCart = () => import("@/views/orderFlow/Cart.vue"); //商城生成订单

const OrderGenWithdraw = () => import("@/views/orderFlow/GenOrderWithdraw.vue"); //生成提货订单
const OrderGenStorage = () => import("@/views/orderFlow/GenOrderStorage.vue"); //生成提货订单

const Paymenttype = () => import("@/views/orderFlow/Paymenttype.vue"); //选择支付方式
const OrderPayResult = () => import("@/views/orderFlow/PayResult.vue"); //商城支付结果页面
const OrderPayResultSuccess = () => import("@/views/orderFlow/PayResultSuccess.vue"); //商城支付成功页面


const Todo = () => import("@/views/todo/Todo.vue"); //待办
const TodoSelectType = () => import("@/views/todo/TodoSelectType.vue"); //待办选择类型
const TodoStorage = () => import("@/views/todo/TodoStorage.vue"); //待办再次存储
const TodoBuyback = () => import("@/views/todo/TodoBuyback.vue"); //待办不出库回购
const TodoWithdraw = () => import("@/views/todo/TodoWithdraw.vue"); //待办提货
const TodoPaymenttype = () => import("@/views/todo/TodoPaymenttype.vue"); //待办选择支付方式
const TodoPayResult = () => import("@/views/todo/TodoPayResult.vue"); //待办支付结果页面
const TodoPayStoreageResult = () => import("@/views/todo/TodoPayStoreageResult.vue"); //待办提货支付结果页面




// const ActivityDetail = () => import("@/views/activity/Detail.vue"); //商城活动详情页
// const ActivityIndex = () => import("@/views/activity/Index.vue");
const CjsjFastbuy = () => import("@/views/activity/CjsjFastbuy.vue"); //存金送金
const FastOrder = () => import("@/views/orderFlow/GenFast.vue"); //存金送金生成订单
const PriceTrend = () => import("@/views/PriceTrend.vue"); //金价趋势

// const ActivityYjhg = () => import("@/views/activity/Yjhg.vue"); //一键回购
const Fwbz = () => import("@/views/activity/Fwbz.vue"); //服务保障
// const Bysc = () => import("@/views/activity/Bysc.vue"); //保养收藏
// const Djjx = () => import("@/views/activity/Djjx.vue"); //低价精选
// const Hjkt = () => import("@/views/activity/Hjkt.vue"); //黄金课堂
const Newbie = () => import("@/views/activity/Newbie.vue"); //新手活动
const Invitation = () => import("@/views/activity/Invitation.vue"); //新手活动



const Node = () => import("@/views/node/Node.vue");






// // 我的首页

// Vue.use(Router)

export default {
  routes: [
    //首页
    {
      path: "/",
      component: Home,
      meta: {
        show_bottom_bar: true,
        keepAlive:true,
        resume_load:true,
      }
    },
    //登录
    {
      path: "/login",
      component: Login,
      meta: {
        show_bottom_bar: false,
        need_login:-1
      }
    },
    //注册
    // {
    //   path: "/register",
    //   component: RegisterIndex,
    //   meta: {
    //     show_bottom_bar: false,
    //     need_login:-1
    //   }
    // },
    //重置登录密码
    {
      path: "/reset_login_password",
      component: ResetLoginPassword,
      meta: {
        show_bottom_bar: false
      }
    },
    //重置交易密码
    // {
    //   path: "/reset_trade_password",
    //   component: ResetTradePassword,
    //   meta: {
    //     show_bottom_bar: false
    //   }
    // },
    //商品
    {
      path: "/goods",
      component: GoodsCategory,
      meta: {
        show_bottom_bar: true,
        keepAlive:true,
        resume_load:true,
      },
      
    },
    {
      path: "/goods/:id",
      component: GoodsDetail,
      meta: {
        show_bottom_bar: false,
      }
    },
    // //帮助中心
    // {
    //   path: "/help/wxpublic",
    //   component: HelpWxPublic,
    //   meta: {
    //     show_bottom_bar: false
    //   }
    // },
    //饰品
    {
      path: "/accessory",
      component: Accessory,
      meta: {
        show_bottom_bar: true,
        keepAlive:true,
        resume_load:true,
      }
    },
    //我的
    {
      path: "/my",
      component: MyHome,
      meta: {
        show_bottom_bar: true,
        need_login: 1,
        keepAlive:true,
        resume_load:true,
      },
      // children: [

      //   {
      //     path: "",
      //     component: MyHome,
      //     meta: {
      //       show_bottom_bar: true,
      //       need_login: 1
      //     }
      //   }
      // ]
    },






    {
      path: "/my/orders",
      component: MyOrders,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    {
      path: "/my/orders/:order_type",
      component: MyOrders,
      meta: {
        show_bottom_bar: true,
        need_login: 1
      }
    },
    {
      path: "/my/orders/:order_type/:order_status",
      component: MyOrders,
      meta: {
        show_bottom_bar: true,
        need_login: 1
      }
    },
    {
      path: "/my/order/buyback/:id",
      component: MyBuybackOrder,
      meta: {
        show_bottom_bar: false,
        need_login: 1,
        no_swip_back:true,
      }
    },
    {
      path: "/my/order/deposit/:id",
      component: MyDepositOrder,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    {
      path: "/my/order/Delivery/:id",
      component: MyDeliveryOrder,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    {
      path: "/my/order/:id",
      component: MyOrder,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的账户
    {
      path: "/my/account",
      component: MyAccount,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的账户收支明细
    {
      path: "/my/account/balance",
      component: MyBalance,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的账户利息明细（赠送克重明细）
    // {
    //   path: "/my/account/interest",
    //   component: MyInterest,
    //   meta: {
    //     show_bottom_bar: false,
    //     need_login: 1
    //   }
    // },
    //我的账户充值
    {
      path: "/my/account/recharge",
      component: MyRecharge,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的账户提现
    {
      path: "/my/account/withdraw",
      component: MyWithdraw,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的地址列表
    {
      path: "/my/addresses",
      component: MyAddresses,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    {
      path: "/my/address/add",
      component: MyAddressAdd,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    // {
    //   path: "/my/address/:id",
    //   component: MyAddress,
    //   meta: {
    //     show_bottom_bar: false,
    //     need_login: 1
    //   }
    // },
    {
      path: "/my/address/:id/edit",
      component: MyAddressEdit,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //系统
    {
      path: "/my/systemsettings",
      component: MySystemSettings,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //关于我们
    {
      path: "/my/systemsettings/about",
      component: AboutUs,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //安全中心
    {
      path: "/my/securitycenter",
      component: MySecurityCenter,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //客户服务
    {
      path: "/my/guestservice",
      component: GuestService,
      meta: {
        show_bottom_bar: false,
        need_login: 0
      }
    },
    //我的优惠券
    {
      path: "/my/coupon",
      component: MyCoupon,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的收藏
    {
      path: "/my/collection",
      component: MyCollection,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的评论中心
    {
      path: "/my/commentscenter",
      component: MyCommentsCenter,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //我的评论详情
    {
      path: "/my/commentsdetail/:order_id",
      component: MyCommentsDetail,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },






    //购物车
    {
      path: "/order/cart",
      component: OrderCart,
      meta: {
        show_bottom_bar: true,
        need_login: 1,
        keepAlive:true,
        resume_load:true,
      }
    },
    //生成快速存储订单
    {
      path: "/order/generate/fastbuy/:activity_id",
      component: FastOrder,
      meta: {
        show_bottom_bar: false,
        need_login: 1,
        can_refresh:false,
        no_history:true,
      }
    },
    //生成存储订单
    {
      path: "/order/generate/storage",
      component: OrderGenStorage,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //生成提货订单
    {
      path: "/order/generate/withdraw",
      component: OrderGenWithdraw,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //选择支付方式
    {
      path: "/order/:order_id/paymenttype",
      component: Paymenttype,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //支付结果
    {
      path: "/order/:order_id/payresult",
      component: OrderPayResult,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //支付成功
    {
      path: "/order/success",
      component: OrderPayResultSuccess,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },

    //待办
    {
      path: "/my/todo",
      component: Todo,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      },
    },

    //待办选择类型
    {
      path: "/my/todo/selecttype/:selected_goods_info",
      component: TodoSelectType,
      meta: {
        show_bottom_bar: false,
        no_history:true,
        need_login: 1
      },
    },

    //待办存储
    {
      path: "/my/todo/generate/storage/:selected_goods_info",
      component: TodoStorage,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //待办不出库回购
    {
      path: "/my/todo/generate/buyback/:order_id",
      component: TodoBuyback,
      meta: {
        show_bottom_bar: false,
        need_login: 1,
        no_history:true,
      }
    },
    //待办提货
    {
      path: "/my/todo/generate/withdraw/:selected_goods_info",
      component: TodoWithdraw,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //待办选择支付类型
    {
      path: "/my/todo/paymenttype/:order_id",
      component: TodoPaymenttype,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //待办提货支付结果
    {
      path: "/my/todo/storeagepayresult/:order_id",
      component: TodoPayStoreageResult,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },
    //待办支付结果
    {
      path: "/my/todo/payresult",
      component: TodoPayResult,
      meta: {
        show_bottom_bar: false,
        need_login: 1
      }
    },


    //服务保障
    {
      path: "/activity/fwbz",
      component: Fwbz,
      meta: {
        show_bottom_bar: false,
        need_login:0
      }
    },
    //低价精选
    // {
    //   path: "/activity/djjx",
    //   component: Djjx,
    //   meta: {
    //     track_name:"djjx",
    //     show_bottom_bar: false,
    //     need_login:0
    //   }
    // },
    //保养收藏
    // {
    //   path: "/activity/bysc",
    //   component: Bysc,
    //   meta: {
    //     show_bottom_bar: false,
    //     need_login:0
    //   }
    // },
    //黄金课堂
    // {
    //   path: "/activity/hjkt",
    //   component: Hjkt,
    //   meta: {
    //     track_name:"hjkt",
    //     show_bottom_bar: false,
    //     need_login:0
    //   }
    // },
    //新手活动
    {
      path: "/activity/newbie",
      component: Newbie,
      meta: {
        track_name:"newbie",
        show_bottom_bar: false,
        need_login:0
      }
    },
    //买金送金
    {
      path: "/activity/cjsj",
      component: CjsjFastbuy,
      meta:{
        track_name:"cjsj",
        need_login:0,
        keepAlive:true,
        show_bottom_bar:false
      }
    },
    //一键回购
    // {
    //   path: "/activity/yjhg",
    //   component: ActivityYjhg,
    //   meta:{
    //     need_login:0,
    //     show_bottom_bar:false
    //   }
    // },
    //邀请活动
    {
      path: "/activity/invitation",
      component: Invitation,
      meta: {
        track_name:"invitation",
        show_bottom_bar: false,
        need_login:0
      }
    },

    //金价趋势
    {
      path: "/pricetrend",
      component: PriceTrend,
      meta: {
        track_name:"pricetrend",
        show_bottom_bar: false,
        // keepAlive:true,
        need_login:0
      }
    },

    
    
    //推广活动
    // {
    //   path: "/activity",
    //   component: ActivityIndex,
    //   children: [
    //     {
    //       path: ":id",
    //       component: ActivityDetail,
    //       meta:{
    //         need_login:0,
    //         show_bottom_bar:false
    //       }
    //     },
    //   ]
    // },

    //cms详情
    {
      path: "/node/:nid",
      component: Node,
      meta: {
        show_bottom_bar: false,
        need_login:0,
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    switch (to.fullPath) {
      case "/goods":
      case "/home":
      case "/my":
        return { x: 0, y: 0 };
        break;
    }
  }
};
