import HomePage from "@/views/AutoStaging/HomePage.vue";
import ApplyPage from "@/views/AutoStaging/ApplyPage.vue";
import RevisePage from "@/views/AutoStaging/RevisePage.vue";
import SuccessPage from "@/views/AutoStaging/SuccessPage.vue";
export default [
    {
        path: '/AutoStaging/HomePage',
        name: '自动分期首页',
        component: HomePage,
        meta:{
          title:"自动分期"
        }
    },
    {
        path: '/AutoStaging/ApplyPage',
        name: '自动分期申请页',
        component: ApplyPage,
        meta:{
          title:"自动分期"
        }
    },
    {
        path: '/AutoStaging/RevisePage',
        name: '自动分期修改页',
        component: RevisePage,
        meta:{
          title:"自动分期"
        }
    },
    {
        path: '/AutoStaging/SuccessPage',
        name: '自动分期申请成功页',
        component: SuccessPage,
        meta:{
          title:"自动分期"
        }
    },
];
