import HomePage from "@/views/ConsumeInstallment/HomePage.vue";
import apply from "@/views/ConsumeInstallment/ApplyPage.vue";
import success from "@/views/ConsumeInstallment/SuccessPage.vue";
export default [
  {
    path: '/consume/HomePage',
    name: '消费分期首页',
    component: HomePage,
    meta:{
      title:"消费分期"
    }
  },
  {
    path: '/consume/ApplyPage',
    name: '消费申请页',
    component: apply,
    meta:{
      title:"消费分期"
    }
  },
  {
    path: '/consume/SuccessPage',
    name: '消费申请成功页',
    component: success,
    meta:{
      title:"消费分期"
    }
  }
]
