import Vue from "vue";
import Vuex from "vuex";
import utils from "@/assets/js/utils.js";

Vue.use(Vuex);

var store = {
  state: {
    pfc_code: "",
    macross: true,
    pjid: "",

    resume_stamp:"",
    pause_resume_stamp:"",

    is_login: false,
    guest_phone: "400-821-0704",
    show_bottom_bar: false,
    mall_token: "",
    location: {
      latitude:31.22114,
      longitude:121.54409,
    },

    has_show_home_welcome:false,


    /*商城*/
    seller_id: "62",

    mall_address: [],
    mall_current_select_address: null,

    mall_current_order: {},
    mall_current_order_tag: "all",

    flip_router:false,


    transitionNameKeepalive:"move-left",
    transitionName:"slide-left",

    router:{},

    cart_animate_trigger:null,
    /************待办所用****************/
    // todo_selected_goods:[],
    /************待办所用****************/
    
    track_info:{},


    temp_cart_info:{
      interest_schema:{},
      goods:[],
      total_interest:0,
    },

    version_info:{},

    on_line:false,

    receive_push:{
      path:"/",
      stamp:"",
    },

    // storage_contract:null,
    // buyback_contract:null,
    // register_contract:null,
    
  },
  getters: {
    getReceivePush:state => {
      return state.receive_push;
    },
    getOnLine:state => {
      return state.on_line;
    },
    getVersionInfo:state => {
      return state.version_info;
    },
    getTempCartInfo:state => {
      return state.temp_cart_info;
    },
    getRouter:state => {
      return state.router;
    },
    getTrackInfo:state => {
      return state.track_info;
    },
    getCartAnimateTrigger:state => {
      return state.cart_animate_trigger;
    },
    getTransitionNameKeepalive:state => {
      return state.transitionNameKeepalive;
    },
    getTransitionName:state => {
      return state.transitionName;
    },
    getFlipRouter: state => {
      return state.flip_router;
    },
    getResumeStamp: state => {
      return state.resume_stamp;
    },
    getPauseResumeStamp: state => {
      return state.pause_resume_stamp;
    },
    getHasShowHomeWelcome: state => {
      return state.has_show_home_welcome;
    },
    getPjid: state => {
      return state.pjid;
    },
    getMacross: state => {
      return state.macross;
    },
    getPfcCode: state => {
      return state.pfc_code;
    },
    getMallCurrentOrderTag: state => {
      return state.mall_current_order_tag;
    },
    getGuestPhone: state => {
      return state.guest_phone;
    },
    getShowBottomBar: state => {
      return state.show_bottom_bar;
    },
    getMallCurrentOrder: state => {
      return state.mall_current_order;
    },
    getMallCurrentSelectAddress: state => {
      return state.mall_current_select_address;
    },
    getMallAddress: state => {
      return state.mall_address;
    },
    getIsLogin: state => {
      return state.is_login;
    },
    getMallToken: state => {
      return state.mall_token || utils.storageGet("mall_token");
    },
    getSellerId: state => {
      return state.seller_id;
    },
    getLocation: state => {
      return state.location;
    },

    /************待办所用****************/
    // getTodoSelectedGoods: state => {
    //   return state.todo_selected_goods;
    // },
    /************待办所用****************/

  },
  mutations: {
    setReceivePush: (state, val) => {
      state.receive_push = val;
    },
    setOnLine: (state, val) => {
      state.on_line = val;
    },
    setVersionInfo: (state, val) => {
      state.version_info = _.merge({},val);
    },
    setTempCartInfo: (state, val) => {
      state.temp_cart_info = _.merge({},val);
    },
    setRouter: (state, val) => {
      state.router = _.merge({},val);
    },
    setTrackInfo: (state, val) => {
      state.track_info = val;
    },
    setCartAnimateTrigger: (state, val) => {
      state.cart_animate_trigger = val;
    },
    setTransitionNameKeepalive: (state, val) => {
      state.transitionNameKeepalive = val;
    },
    setTransitionName: (state, val) => {
      state.transitionName = val;
    },
    setFlipRouter: (state, val) => {
      state.flip_router = val;
    },
    setResumeStamp: (state, val) => {
      state.resume_stamp = val;
    },
    setPauseResumeStamp: (state, val) => {
      state.pause_resume_stamp = val;
    },
    setHasShowHomeWelcome: (state, val) => {
      state.has_show_home_welcome = val;
    },
    setCloseHomeWelcome: (state, val) => {
      state.close_home_welcome = val;
    },
    setLocation: (state, location) => {
      state.location = location;
    },
    setPjid: (state, pjid) => {
      state.pjid = pjid;
    },
    setMacross: (state, macross) => {
      state.macross = macross;
    },
    setPfcCode: (state, pfc_code) => {
      state.pfc_code = pfc_code;
    },
    setMallCurrentOrderTag: (state, mall_current_order_tag) => {
      state.mall_current_order_tag = mall_current_order_tag;
    },
    setGuestPhone: (state, guest_phone) => {
      state.guest_phone = guest_phone;
    },
    setShowBottomBar: (state, show_bottom_bar) => {
      state.show_bottom_bar = show_bottom_bar;
    },
    setMallCurrentOrder: (state, mall_current_order) => {
      state.mall_current_order = mall_current_order;
    },
    setMallCurrentSelectAddress: (state, mall_current_select_address) => {
      state.mall_current_select_address = mall_current_select_address;
    },
    setMallAddress: (state, mall_address) => {
      state.mall_address = mall_address;
    },
    setIsLogin: (state, is_login) => {
      state.is_login = is_login;
    },
    setMallToken: (state, mall_token) => {
      state.mall_token = mall_token;
    },


    /************待办所用****************/
    // setTodoSelectedGoods: (state, goods) => {
    //   state.todo_selected_goods = goods;
    // },
    /************待办所用****************/
  }
};

export default new Vuex.Store(store);
