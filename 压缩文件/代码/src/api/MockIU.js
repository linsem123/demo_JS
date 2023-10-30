const Mock = require('mockjs');

//是否可在线更新有效期
const updateValidity = {
  success: true,
  data: {
    keyUUID: '7668fa62f49d4bc7ab914224e99d5d1e'
  },
  msg: '失败',
  code: '000001'
};

//上传图片
const uploadPicture ={
  success: true,
  data: {
    pictureName: '1.png'
  },
  msg: '失败',
  code: '000001'
};

//人脸识别
const recoFace = {
  success: true,
  data: {
    sendSmsFlag: '1' //1- 跳短信  0-跳身份证
  },
  msg: '失败',
  code: '000001'
};

//发送短信
const getSmsCodeHk = {
  success: true,
  data: {
    length:1,
    smsCode: '123456',
    noFirstSend: '1' //0-调取获取滑块接口 1-直接发短信发短信
  },
  code: '失败',
  msg: '操作频繁，请稍后重试'
};

//获取滑块
const getSlider = {
  success: true,
  data: {
    bigimgStr: require('@/assets/images/common/bg.jpg'),
    tarimgStr: require('@/assets/images/common/slide.png')
  },
  code: '失败',
  msg: '操作频繁，请稍后重试'
};

//校验短信验证码
const checkSmsCode = {
  success: true,
  data: {
  },
  code: '失败',
  msg: '操作频繁，请稍后重试'
};


Mock.mock(/\/iu\/updateValidity/, 'post', updateValidity);
Mock.mock(/\/iu\/uploadPicture/, 'post', uploadPicture);
Mock.mock(/\/iu\/recoFace/, 'post', recoFace);
Mock.mock(/\/iu\/getSmsCodeHk/, 'post', getSmsCodeHk);
Mock.mock(/\/iu\/getSlider/, 'post', getSlider);
Mock.mock(/\/iu\/checkSmsCode/, 'post', checkSmsCode);
