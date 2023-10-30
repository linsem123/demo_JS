import HomePage from "@/views/LendCash/HomePage.vue";
import AddPage from "@/views/LendCash/AddPage.vue";
import SelectPage from "@/views/LendCash/SelectPage.vue";
import SuccessPage from "@/views/LendCash/SuccessPage.vue";
import ResultPage from "@/views/LendCash/ResultPage.vue";
export default [
    {
        path: '/LendCash/HomePage',
        name: '预借现金首页',
        component: HomePage,
        meta:{
          title:"预借现金"
        }
    },
    {
        path: '/LendCash/AddPage',
        name: '添加借记卡',
        component: AddPage,
        meta:{
          title:"预借现金"
        }
    },
    {
        path: '/LendCash/SelectPage',
        name: '选择借记卡',
        component: SelectPage,
        meta:{
          title:"预借现金"
        }
    },
    {
        path: '/LendCash/SuccessPage',
        name: '申请成功页',
        component: SuccessPage,
        meta:{
          title:"预借现金"
        }
    },
    {
        path: '/LendCash/ResultPage',
        name: '申请结果页',
        component: ResultPage,
        meta:{
          title:"预借现金"
        }
    }
]