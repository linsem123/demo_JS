
 import HomePage from "@/views/Installment/HomePage.vue";
 import SuccessPage from "@/views/Installment/SuccessPage.vue";
 import FailPage from "@/views/Installment/FailPage.vue";
export default [
    {
        path: '/Installment/HomePage',
        name: '账单分期首页',
        component: HomePage,
        meta:{
          title:"账单分期"
        }
    },
    {
        path: '/Installment/SuccessPage',
        name: '账单分期申请成功',
        component:  SuccessPage,
        meta:{
          title:"账单分期"
        }
    },
    {
        path: '/Installment/FailPage',
        name: '账单分期申请失败',
        component:FailPage,
        meta:{
          title:"账单分期"
        }
    }
];

