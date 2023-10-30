import LoginPage from "@/views/IdUpdate/LoginPage.vue";
import HomePage from '@/views/idUpdate/HomePage';
import IdentifyPage from '@/views/idUpdate/IdentifyPage';
import UploadIdCard from "@/views/IdUpdate/UploadIdCard.vue";
import InfoConfirm from "@/views/IdUpdate/InfoConfirm.vue";
import SuccessPage from "@/views/IdUpdate/SuccessPage.vue";
import FreeLoginPage from "@/views/IdUpdate/FreeLoginPage.vue";
import BintangPage from "@/views/IdUpdate/BintangPage.vue";
export default [
  {
    path: '/IdUpdate/LoginPage',
    name: '证件有效期更新登录页面',
    component: LoginPage,
    meta:{
      title:"登录"
    }
  },
  {
    path: '/IdUpdate/HomePage',
    name: '证件有效期更新人脸拍摄页',
    component: HomePage,
    meta:{
      title:'身份验证'
    }
  },
  {
    path: '/IdUpdate/IdentifyPage',
    name: '证件有效期更新短信验证页',
    component: IdentifyPage,
    meta:{
      title:'短信验证'
    }
  },
  {
    path: '/IdUpdate/UploadIdCard',
    name: '证件有效期更新身份证上传页面',
    component: UploadIdCard,
    meta:{
      title:"身份证上传"
    }
  },
  {
    path: '/IdUpdate/InfoConfirm',
    name: '证件有效期更新信息确认页面',
    component: InfoConfirm,
    meta:{
      title:"信息确认"
    }
  },
  {
    path: '/IdUpdate/SuccessPage',
    name: '证件有效期更新更新结果页面',
    component: SuccessPage,
    meta:{
      title:"更新结果"
    }
  },
  {
    path: '/i/f',
    name: '证件有效期更新网页版免登页',
    component: FreeLoginPage,
    meta:{
      title:"证件更新网页"
    }
  },
  {
    path: '/IdUpdate/BintangPage',
    name: '证件有效期更新微信版免登页',
    component: BintangPage,
    meta:{
      title:"证件更新微信"
    }
  }
]