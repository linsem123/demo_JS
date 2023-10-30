
 import enterhome from "@/views/financial/turnmoney/enterhome.vue";
 import entersuccess from "@/views/financial/turnmoney/entersuccess.vue";
 import outhome from "@/views/financial/turnmoney/outhome.vue";
 import outsuccess from "@/views/financial/turnmoney/outsuccess.vue";
//  import region from "@/views/financial/opendoor/region.vue";
//  import Homepage from "@/views/financial/turnmoney/Homepage.vue";
 
export default [
    {
        path: '/turnmoney/enterhome',
        name: '转入',
        component: enterhome,
        meta:{
          title:"转入"
        }
    },
    {
        path: '/turnmoney/entersuccess',
        name: '转入成功',
        component: entersuccess,
        meta:{
          title:"转入成功"
        }
    },
    {
        path: '/turnmoney/outhome',
        name: '转出',
        component:outhome,
        meta:{
          title:"转出"
        }
    },
    {
        path: '/turnmoney/outsuccess',
        name: '转出',
        component:outsuccess,
        meta:{
          title:"转出成功"
        }
    },
    
];

