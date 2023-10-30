import HomePage from "@/views/BorrowedMoney/HomePage.vue";
import SelectPage from "@/views/BorrowedMoney/SelectPage.vue";
import AddPage from "@/views/BorrowedMoney/AddPage.vue";
import SuccessPage from "@/views/BorrowedMoney/SuccessPage.vue";
export default [
    {
        path: '/BorrowedMoney/HomePage',
        name: '随借金首页',
        component: HomePage,
        meta:{
          title:"随借金"
        }
    },
    {
        path: '/BorrowedMoney/SelectPage',
        name: '随借金选择银行',
        component: SelectPage,
        meta:{
          title:"随借金"
        }
    },
    {
        path: '/BorrowedMoney/AddPage',
        name: '随借金添加银行',
        component: AddPage,
        meta:{
          title:"随借金"
        }
    },
    {
        path: '/BorrowedMoney/SuccessPage',
        name: '随借金申请成功',
        component: SuccessPage,
        meta:{
          title:"随借金"
        }
    },
];