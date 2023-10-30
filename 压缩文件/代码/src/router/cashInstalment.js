import HomePage from "@/views/CashInstalment/HomePage.vue";
import promotionStatistics from "@/views/CashInstalment/promotionStatistics";
import share from "@/views/CashInstalment/share";
import addDebitCard from "@/components/ylAddDebitCard";
import applySuccess from "@/views/CashInstalment/successPage";

export default [
  {
    path: '/CashInstalment/HomePage',
    name: '现金分期首页',
    component: HomePage,
    meta:{
      title:"现金分期"
    }
  },{
    path: '/CashInstalment/applySuccess',
    name: '申请结果',
    component: applySuccess,
    meta:{
      title:"申请结果"
    }
  },{
    path: '/addDebitCard',
    name: '现金分期添加借记卡',
    component: addDebitCard,
    meta:{
      title:"添加借记卡"
    }
  },{
    path: '/CashInstalment/promotion',
    name: '推广',
    component: promotionStatistics,
    meta:{
      // title:"现金分期分享"
    }
  },
  {
    path: '/CashInstalment/share',
    name: '推广分享',
    component: share,
    meta:{
      // title:"现金分期分享"
    }
  }
]
