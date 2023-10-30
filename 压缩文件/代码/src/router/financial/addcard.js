import cardPage from "@/views/financial/cardPage.vue";
import addPage from "@/views/financial/addPage.vue";
import selectPage from "@/views/financial/selectPage.vue";
 
export default [
    {
        path: '/TimLee/cardPage',
        name: '添加借记卡',
        component: cardPage,
        meta:{
            title:"我的银行卡"
        }
    },
    {
        path: '/TimLee/addPage',
        name: '添加借记卡',
        component: addPage,
        meta:{
            title:"添加借记卡"
        }
    },
    {
        path: '/TimLee/selectPage',
        name: '添加借记卡',
        component: selectPage,
        meta:{
            title:"选择借记卡"
        }
    }
];