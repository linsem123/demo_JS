// let HTTP_URL = "https://test.xliane.com/evercos/main/";           //UAT
// let HTTP_URL = "https://test.xliane.com/evercos2/main/";          //主干
// let HTTP_URL = "https://test.xliane.com/evercos3/main/";          //分支
// let HTTP_URL="https://ccshop.cib.com.cn:8010/evercos/main/";         //生产
import {environment} from "@/assets/js/common.js";
let HTTP_URL = environment();
export  {HTTP_URL}
