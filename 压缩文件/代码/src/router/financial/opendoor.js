
 import Homepage from "@/views/financial/opendoor/Homepage.vue";
 import Wchangeuse from "@/views/financial/opendoor/Wchangeuse.vue";
 import Success from "@/views/financial/opendoor/Success.vue";
 
export default [
    {
        path: '/opendoor/Homepage',
        name: '开户首页',
        component: Homepage,
        meta:{
          title:"开户"
        }
    },
    {
        path: '/opendoor/Wchangeuse',
        name: '开户首页',
        component: Wchangeuse,
        meta:{
          title:"切换"
        }
    },
    {
        path: '/opendoor/Success',
        name: '开户成功',
        component: Success,
        meta:{
          title:"开户成功"
        }
},
        
    
  
];

