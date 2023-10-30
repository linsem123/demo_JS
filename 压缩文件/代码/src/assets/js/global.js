let CONTEXT = process.env.PATH;                            // 后端环境(evercos)
let FRONT = process.env.FRONT;                             // 前端环境(html)
let SCHEME = window.location.protocol + '//';              // http协议名(http:/https:)
let HOST = window.location.host;                           // 域名
let PORT = HOST === 'ccshop.cib.com.cn' ? ':8010' : '';    // 端口号
 
let URL = SCHEME + HOST + PORT + CONTEXT;                  // 后端环境链接(https://test.xliane.com/evercos)
let FRONT_URL = SCHEME + HOST + PORT + FRONT;              // 前端环境链接((https://test.xliane.com/html))

export default {
  CONTEXT,
  SCHEME,
  HOST,
  PORT,
  URL,
  FRONT_URL
}