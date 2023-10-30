import LoginPage from "@/views/Enjoyloan/LoginPage.vue";
import HomePage from "@/views/Enjoyloan/HomePage.vue";
import SelectPage from "@/views/Enjoyloan/SelectPage.vue";
import AddPage from "@/views/Enjoyloan/AddPage.vue";
import SuccessPage from "@/views/Enjoyloan/SuccessPage.vue";
import FailPage from "@/views/Enjoyloan/FailPage.vue";
export default [
    {
        path: '/Enjoyloan/HomePage',
        name: '兴享贷首页',
        component: HomePage,
        meta:{
          title:"兴享贷"
        }
    },
    {
        path: '/Enjoyloan/LoginPage',
        name: '登录页',
        component: LoginPage,
        meta:{
          title:"兴享贷"
        }
    },
    {
        path: '/Enjoyloan/SelectPage',
        name: '选择银行',
        component: SelectPage,
        meta:{
          title:"兴享贷"
        }
    },
    {
        path: '/Enjoyloan/AddPage',
        name: '添加银行',
        component: AddPage,
        meta:{
          title:"兴享贷"
        }
    },
    {
        path: '/Enjoyloan/SuccessPage',
        name: '申请成功',
        component: SuccessPage,
        meta:{
          title:"兴享贷"
        }
    },
    {
        path: '/Enjoyloan/FailPage',
        name: '申请失败',
        component: FailPage,
        meta:{
          title:"兴享贷"
        }
    }
];
