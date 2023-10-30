import yindex from "@/views/financial/yindex";
import home from "@/views/financial/home";
import prodes from "@/views/financial/prodes";
import licaiDetail from "@/views/financial/licaiDetail";
export default [
    {
        name:"",
        path:"/tianli/index",
        component:yindex
    },
    {
        name:"home",
        path:"/tianli/home",
        component:home,
        meta:{
            title:"理财账户"
        }
    },
    {
        name:"prodes",
        path:"/tianli/prodes",
        component:prodes,
        meta:{
            title:"添利1号"
        }
    },
    {
        name:"licaiDetail",
        path:"/tianli/licaiDetail",
        component:licaiDetail,
        meta:{
            title:"理财明细"
        }
    }
]