import HomePage from "@/views/Sxf/HomePage.vue";
import SuccessPage from "@/views/Sxf/SuccessPage.vue";
import FailPage from "@/views/Sxf/FailPage.vue";
export default [
    {
        path: '/Sxf/HomePage',
        name: '随兴分首页',
        component: HomePage,
        meta:{
          title:"随兴分"
        }
    },
    {
        path: '/Sxf/SuccessPage',
        name: '随兴分申请成功页',
        component: SuccessPage,
        meta:{
          title:"随兴分"
        }
    },
    {
        path: '/Sxf/FailPage',
        name: '随兴分失败页',
        component: FailPage,
        meta:{
          title:"随兴分"
        }
    },
]