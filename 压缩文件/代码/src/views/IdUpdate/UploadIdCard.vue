<template>
    <div class="main bg-fixed" >
        <div class="head">
            <input type="file" id="file1" accept="image/*" style="display:none;" ref="file1" @change="setImage1" >
            <input type="file" id="file2" accept="image/*" style="display:none;" ref="file2" @change="setImage2">
            <div class="pros" @click="pros">
                <img src="@/assets/images/idupdate/pros.png" alt="" class="pic" id="img1" >
                <img src="@/assets/images/idupdate/upload.png" alt="" class="upload" >
                <input id="fileName1" type="hidden" value="" />
                <p class="t1">上传身份证头像面</p>
                <p class="t2">请<span>横屏</span>拍摄</p>
            </div>
            <div class="cons" @click="cons" >
                <img src="@/assets/images/idupdate/cons.png" alt="" class="pic" id="img2">
                <img src="@/assets/images/idupdate/upload.png" alt="" class="upload" >
                <input id="fileName2" type="hidden" value="" />
                <p class="t1">上传身份证国徽面</p>
                <p class="t2">请<span>横屏</span>拍摄</p>
            </div>
            <canvas id="canvans" style="display:none"></canvas>
        </div>
        <div class="info">
            <h4>友情提示：</h4>
            <div class="remind">
                <p>a.请确保本人操作且上传证件真实有效，如有虚假，将自行承担一切法律后果；</p>
                <p>b.请保证光线充足，身份证上不要有阴影和反光；</p>
                <p>c.请横屏拍摄，尽量让您的身份证充满拍摄预览区域；</p>
                <p>d.请对焦清晰后再进行拍摄。</p>
            </div>
            <div id="confirm" @click="confirm">确认上传</div>
        </div>
        <div class="layer" v-show="laystatu"></div>
        <div class="remindContent" v-show="reminderstatu">
            <div class="remind-txt">{{pubdata.remindMsg}}<a href="tel:95561" v-show="pubui.telShow">95561</a></div>
            <div id="reconfirm" @click="reconfirm">确定</div>
        </div>
        <YVersion :version="version" top="10%"></YVersion>
        <YErrorAlert :msg="idcard.msg" :err="idcard.err" :show="idcard.showAlert" @confirm="confirm_idcard"></YErrorAlert>
    </div>
</template>
<script>
import YVersion from "../../components/YVersion";
import YErrorAlert from "../../components/YErrorAlert";
import {mapActions,mapState} from "vuex";
import {initsa,track,saAlert,getBlob,getFormData,compress} from "@/assets/js/common.js"; //听云监听
import iu from "@/api/iu.js";
import EXIF from "exif-js";
import {Loading} from "element-ui";
export default {
    name: 'UploadIdCard', //上传身份证
    data () {
      return { //绑定数据
        maxFileSize:1024*1024,
        imgUrl:"",
      }
    },
    components:{
        YVersion,
        YErrorAlert
    },
    computed:mapState({
        loginFlag: state => state.com.login.loginFlag,   // 判断登录状态 登录为true 未登为false 
        loginkhid:state => state.com.login.loginkhid,    // 登录生成的khid
        loginuuid:state => state.com.login.loginuuid,    // 登录生成的uuid
        pubdata:state => state.iu.public.pubdata,
        pubui:state => state.iu.public.pubui,
        laystatu:state => state.iu.public.pubmenu.laystatu,
        reminderstatu:state => state.iu.public.pubmenu.reminderstatu,
        keyUUID:state => state.iu.keyUUID,
        khid:state => state.iu.khid,
        version: state => state.iu.version,
        closeFlag: state => state.iu.closeFlag,
        idcard: state => state.iu.alert.idcard,
    }),
    created(){
      initsa("证件有效期更新身份证上传页"); //初始化监听
      this.changeLogin();
    },
    methods:{
        changeLogin(){
            if(this.loginFlag==true){  // 登录状态 更改khid uuid
                this.$store.commit('iu/CHANGELOGINID',{
                    loginkhid:this.loginkhid,
                    loginuuid:this.loginuuid
                })
            }
        },
        pros(){      // 正面照
            this.$refs.file1.click();
        },
        cons(){      // 反面照
            this.$refs.file2.click();
        },
        setImage1(){
            this.setImagePreview(1);
        },
        setImage2(){
            this.setImagePreview(2);
        },
        setImagePreview(id){
            var _this = this;
            var file = $("#file"+id).get(0).files[0];
            if(file==''){
                $.alert("文件为空","提示");
                return;
            }
            try{
                if((!/jpeg|png|jpg|bmp/.test(file.type)) && file.type!=""){
                    $.alert("仅支持上传jpg、jpeg、png、bmp格式的图片","提示");
                    return;
                }else if(file.type==""){
                    $.alert("暂不支持图片上传，请您拍照上传","提示");
                    return;
                }
            }catch(err){
                return;
            }
            var Orientation;
            //旋转问题
            EXIF.getData(file, function () {
                Orientation = EXIF.getTag(this, 'Orientation');
            });
            var fileReader = new FileReader();
            //获取图片大小 KB/MB
            var fileSize = file.size/1024>1024?(file.size/1024/1024).toFixed(2)+"MB":~~(file.size/1024)+"KB";
            fileReader.onload = function(){  
                var result = this.result;
                this.imgUrl = result;
                var image = new Image();
                image.src = result;//生成一张图片 并设置src源
                // 图片小于20K
                if(result.length <= (20*1024)){
                    _this.router.dispatch("iu/picerror",{
                        laystatu:this.laystatu,
                        reminderstatu:this.reminderstatu
                    });
                    return;
                }else if(result.length > (20*1024) && result.length <= _this.maxFileSize){
                    image = null;
                    _this.upload(result,file.type,id);
                    return;
                }else if(result.length > _this.maxFileSize){
                    image.onload = () => {
                        compress(image,Orientation,file.type);
                        var data = compress(image,Orientation,file.type);
                         if(result.length <= (20*1024)){
                            _this.router.dispatch("iu/picerror",{
                                laystatu:this.laystatu,
                                reminderstatu:this.reminderstatu
                            });
                            return false;
                        }
                        _this.upload(data,file.type,id);
                    }
                    
                }
            }
            fileReader.readAsDataURL(file);
        },
        //图片上传，将base64的图片转成二进制对象，放入formdata上传
        upload(basestr,type,id){
            var text = window.atob(basestr.split(",")[1]);
            var buffer = new Uint8Array(text.length);
            var pecent = 0, loop = null;
            for (var i = 0; i < text.length; i++) {
                buffer[i] = text.charCodeAt(i);
            }
            var blob = getBlob([buffer],type);
            var formdata = getFormData();  
            var filename = "blob.jpg";
            formdata.append('file',blob,filename);
            formdata.append("faceFlag",id);
            formdata.append("khid",this.khid);
            formdata.append("uuid",this.keyUUID);
            var loadinginstace = Loading.service({
                fullscreen: true,
                lock: true,
                text: '图片上传中...',
                spinner: 'el-icon-loading2',
                background: 'rgba(0, 0, 0, 0.5)'
            });
            iu.uploadPic(formdata).then((res)=>{
                loadinginstace.close();
                if(res.success==true){
                    $("#fileName"+res.faceFlag).val(res.faceFlag);
                    this.showImg(res.faceFlag,basestr);
                }else if(res.success==false){
                    saAlert("证件有效期更新身份证上传","图片上传",res.msg,"报错提示");
                    $("#fileName"+id).val("");
                    $("#img"+id).next().css('display','block');
                    $("#img"+id).next().next().next().css('display','block');
                    $("#img"+id).next().next().next().next().css('display','block');
                    if(id==1){
                        $("#img"+id).attr({'src':require("@/assets/images/idupdate/pros.png"),'width':257+'px','height':160+'px'}); 
                    }else if(id==2){
                        $("#img"+id).attr({'src':require("@/assets/images/idupdate/cons.png"),'width':257+'px','height':160+'px'}); 
                    }
                    if(res.code=="RO200088"){
                        var Msg = "上传图片失败次数过多，请稍后重试";
                        this.$store.dispatch("iu/failmoretime",{
                            msg:Msg
                        }); 
                    }else{
                        this.$store.dispatch("iu/showremind",{
                            msg:res.msg
                        }); 
                    }
                }
            }).catch((err)=>{
                console.log(err);
                loadinginstace.close();
                if(err.response.status){
                    saAlert("证件有效期更新身份证上传","图片上传",err.response.status+err.response.statusText,"请求报错");
                }else{
                    saAlert("证件有效期更新身份证上传","图片上传","请求失败","请求报错");
                }
            });
        },
        //显示图片
        showImg(id,basestr){
            var img = new Image();
            img.src = basestr;
            var w1 = img.width;
            var h1 = img.height;
            $("#img"+id).attr({'src':basestr,'width':257+'px','height':160+'px'}); 
            $("#img"+id).next().css('display','none');
            $("#img"+id).next().next().next().css('display','none');
            $("#img"+id).next().next().next().next().css('display','none');
        },
        confirm(){ //确认上传
            var profile = $("#fileName1").val();
            var confile = $("#fileName2").val();
            if(profile!="" && confile!=""){
                track("idupdate_idcardUpload","证件有效期更新身份证上传确认按钮");
                this.$store.dispatch('iu/uploadidcard',{
                    router:this.$router
                });
            }else{
                $.alert("请上传身份证正反面","提示");
            }
        },
        reconfirm(){ //关闭提示
            this.$store.dispatch("iu/hideremind",{
                laystatu:this.laystatu,
                reminderstatu:this.reminderstatu
            });
            if(this.closeFlag == true){
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    WeixinJSBridge.call('closeWindow');
                }else{
                    var userAgent = navigator.userAgent; 
                    if(userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) { 
                        window.location.href="about:blank"; 
                        window.close();
                    }else if(userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1){ 
                        window.opener=null;window.open("about:blank","_self","").close(); 
                        window.close();
                    }else { 
                        window.opener = null; 
                        window.open("about:blank", "_self"); 
                        window.close(); 
                    }   
                }
            }
        },
        confirm_idcard() {
            this.$store.commit('iu/SETIDCARDALERT', {show: false, msg: '', err: ''});
        },
    }
    
}
</script>
<style scoped>
.main{background:#fff;}
.bg-fixed{position: fixed;overflow: auto;top:0;left:0;bottom:0;right:0;}
.head{margin-top:0.3rem;padding:0 15.7%;}
.pros{position: relative;}
.cons{position: relative;margin:0.18rem 0 0.4rem;}
.pic{width: 100%;}
.upload{width:0.34rem;height: 0.34rem;position: absolute;top: 0.42rem;left: 0;right: 0;margin: auto;}
.t1{color: #fff;font-size: 0.16rem;height: 0.22rem;line-height: 0.22rem;position: absolute;top: 0.86rem;text-align: center;
left: 0;right: 0;margin: auto;}
.t2{color: #fff;font-size: 0.16rem;height: 0.22rem;line-height: 0.22rem;position: absolute;top: 1.06rem;text-align: center;
left: 0;right: 0;margin: auto;}
.t2 span{color:rgb(231,16,52);}
.info{padding:0 5.3%;}
.info h4{font-size: 0.14rem;color: #666;letter-spacing: 0;line-height: 0.18rem;height: 0.18rem;font-weight: 300;margin-bottom: 0.04rem;}
.remind p{font-size: 0.12rem;color: #999;letter-spacing: 0;line-height: 0.17rem;}
#confirm{background: #5084FF;border-radius: 0.22rem;text-align: center;margin-top: 0.32rem;font-size: 0.16rem;color: #fff;
letter-spacing: 0.0019rem;height: 0.45rem;line-height: 0.45rem;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
.remindContent{position: absolute;margin: 0 13.9%;background:#fff;border-radius: 0.12rem;z-index: 666;top:1.68rem;
width:72.3%;text-align: center;}
.remind-txt{font-size: 0.16rem;line-height: 0.22rem;padding:0.23rem 0.24rem;border-bottom: 0.01rem solid #eaeaea;}
#reconfirm{font-size: 0.17rem;color: #0060F1;line-height: 0.24rem;height: 0.24rem;padding:0.12rem 0;}
</style>

