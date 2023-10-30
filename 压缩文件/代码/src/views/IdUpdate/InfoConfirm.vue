<template>
    <div class="main bg-fixed">
        <div class="li-cell te unchange">
            <div class="login-cell">
                <div class="cell-left"><label for="indentType">证件类型</label></div>
                <input type="text" value="居民身份证" id="indentType" readonly="readonly">
            </div>
        </div>
        <div class="li-cell unchange cut">
            <div class="login-cell">
                <div class="cell-left"><label for="Name">姓名</label></div>
                <input type="text" v-model="infodata.Name" id="Name" readonly="readonly">
            </div>
        </div>
        <div class="li-cell unchange cut">
            <div class="login-cell">
                <div class="cell-left"><label for="indentNum">证件号码</label></div>
                <input type="tel" v-model="infodata.indentNum" id="indentNum" readonly="readonly">
            </div>
        </div>
        <div class="li-cell cut" v-show="infoui.shortShow">
            <div class="login-cell" @click="choseStart">
                <div class="cell-left"><label for="startDate">起始日期</label></div>
                <input type="tel" v-model="infodata.startTime" id="startDate" readonly="readonly">
                <img src="@/assets/images/to.png" alt="" class="to">
            </div>
        </div>
        <van-popup v-model="infodata.startShow" position="bottom" width="100%">
            <van-datetime-picker
                v-model="startDate"
                type="date"
                title="日期"
                :formatter="formatter"
                @cancel="startCancel"
                @confirm="startConfirm"
                :min-date="startminDate"
                :max-date="startmaxDate"
            />
        </van-popup>
        <div class="li-cell" v-show="infoui.shortShow">
            <div class="login-cell" @click="choseEnd">
                <div class="cell-left"><label for="endDate">失效日期</label></div>
                <input type="tel" v-model="infodata.endTime" id="endDate" readonly="readonly">
                <img src="@/assets/images/to.png" alt="" class="to">
            </div>
        </div>
        <van-popup v-model="infodata.endShow" position="bottom" width="100%">
            <van-datetime-picker
                v-model="endDate"
                type="date"
                title="日期"
                :formatter="formatter"
                @cancel="endCancel"
                @confirm="endConfirm"
                :min-date="endminDate"
                :max-date="endmaxDate"
            />
        </van-popup>
        <div class="li-cell unchange" v-show="infoui.longShow">
            <div class="login-cell">
                <div class="cell-left"><label for="long">有效期限</label></div>
                <input type="tel" value="长期有效" id="long" readonly="readonly">
            </div>
        </div>
        <div class="confirm-txt">请确认以上本人身份信息真实有效</div>
        <div id="confirmtrue" @click="confirmtrue">确认提交</div>
        <div class="layer" v-show="laystatu"></div>
        <div class="remindContent" v-show="reminderstatu">
            <div class="remind-txt">{{pubdata.remindMsg}}<a href="tel:95561" v-show="pubui.telShow">95561</a></div>
            <div id="reconfirm" @click="reconfirm">确定</div>
        </div>
        <YVersion :version="version" top="5%"></YVersion>
        <YErrorAlert :msg="coninfo.msg" :err="coninfo.err" :show="coninfo.showAlert" @confirm="confirm_coninfo"></YErrorAlert>
    </div>
</template>
<script>
import YVersion from "../../components/YVersion";
import YErrorAlert from "../../components/YErrorAlert";
import {mapActions,mapState} from "vuex";
import {initsa,track,getBlob,getFormData} from "@/assets/js/common.js"; //听云监听
import {Popup} from "vant";
export default {
    name: 'InfoConfirm', //上传身份证
    data () {
      return { //绑定数据
        startDate:"",
        endDate:"",
        startminDate:new Date(1950,1,1),
        startmaxDate:new Date(),
        endminDate:new Date(),
        endmaxDate:new Date(2080,1,1)
      }
    },
    components:{
        YVersion,
        YErrorAlert
    },
    computed:mapState({
        pubdata:state => state.iu.public.pubdata,
        loginFlag: state => state.com.login.loginFlag,   // 判断登录状态 登录为true 未登为false 
        pubui:state => state.iu.public.pubui,
        laystatu:state => state.iu.public.pubmenu.laystatu,
        reminderstatu:state => state.iu.public.pubmenu.reminderstatu,
        infodata:state => state.iu.info.infodata,
        infoui:state => state.iu.info.infoui,
        version: state => state.iu.version,
        coninfo: state => state.iu.alert.coninfo,
        freeFlag: state => state.iu.freeFlag
    }),
    created(){
      initsa("证件有效期更新信息确认页"); //初始化监听
    },
    methods:{
        reconfirm(){ //关闭提示
            this.$store.dispatch("iu/hideremind",{
                laystatu:this.laystatu,
                reminderstatu:this.reminderstatu
            });
        },
        choseStart(){
            this.startDate = new Date(this.infodata.startTime);
            this.$store.dispatch("iu/showstartdate",{
                infodata:this.infodata
            });
        },
        startCancel(){
            this.$store.dispatch("iu/hidestartdate",{
                infodata:this.infodata
            });
        },
        startConfirm(v){
            var endvalue = new Date(v);
            var Y = endvalue.getFullYear() + '/';
            var M = (endvalue.getMonth()+1 < 10 ? '0'+(endvalue.getMonth()+1) : endvalue.getMonth()+1)+'/';
            var D = (endvalue.getDate() < 10 ? '0'+endvalue.getDate() : endvalue.getDate());
            var newTime = Y+M+D;
            this.$store.dispatch("iu/changestartdate",{
                infodata:this.infodata,
                newTime:newTime
            });
        },
        choseEnd(){
            this.endDate = new Date(this.infodata.endTime);
            this.$store.dispatch("iu/showenddate",{
                infodata:this.infodata
            });
        },
        endCancel(){
            this.$store.dispatch("iu/hideenddate",{
                infodata:this.infodata
            });
        },
        endConfirm(v){
            var endvalue = new Date(v);
            var Y = endvalue.getFullYear() + '/';
            var M = (endvalue.getMonth()+1 < 10 ? '0'+(endvalue.getMonth()+1) : endvalue.getMonth()+1)+'/';
            var D = (endvalue.getDate() < 10 ? '0'+endvalue.getDate() : endvalue.getDate());
            var newTime = Y+M+D;
            this.$store.dispatch("iu/changeenddate",{
                infodata:this.infodata,
                newTime:newTime
            });
            console.log(this.infodata.endTime);
        },
        formatter(type, value) {
            if(type === 'year') {
                return `${value}年`;
            }else if (type === 'month') {
                return `${value}月`
            }else if(type === 'day'){
                return `${value}日`
            }
            return value;
        },
        confirmtrue(){ //确认提交
            track("idupdate_confirmSubmit","证件有效期更新信息确认页确认提交按钮");
            this.$store.dispatch("iu/submitinfo",{
                infoui:this.infoui,
                infodata:this.infodata,
                pubui:this.pubui,
                router:this.$router,
                loginFlag:this.loginFlag,
                freeFlag:this.freeFlag
            })
        },
        confirm_coninfo() {
            this.$store.commit('iu/SETINFOALERT', {show: false, msg: '', err: ''});
        },
    }
    
}
</script>
<style scoped>
.choselong a{font-size: 0.14rem;height: 0.36rem;line-height: 0.36rem;margin-left: 0.1rem;}
.main{background:#f3f5f9;}
.bg-fixed{position: fixed;overflow: hidden;top:0;left:0;bottom:0;right:0;}
.te{margin:0.1rem 0;border:none;}
.unchange{color:#666;}
.cut{position: relative;}
.cut::after{content: "";background: #eaeaea;height: 0.01rem;position: absolute;bottom: 0;width: 100%;left: 5.3%;}
.login-cell{display: flex;padding: 0.16rem 5.3%;box-sizing: border-box;background:#fff;position: relative;}
.cell-left{width: 0.8rem;margin-right: 0.3rem;height: 0.24rem;line-height: 0.24rem;font-size: 0.15rem;}
.login-cell input{border: none;font-size: 0.15rem;height: 0.24rem;line-height: 0.24rem;width:2rem;}
.to{width: 0.14rem;height: 0.14rem;position: absolute;top: 0.21rem;right: 5.3%;}
.confirm-txt{font-size: 0.12rem;color: #666;line-height: 0.18rem;padding-left: 5.3%;margin-top: 0.08rem;}
#confirmtrue{background: #5084FF;border-radius: 0.22rem;text-align: center;font-size: 0.16rem;color: #fff;
letter-spacing: 0.0019rem;height: 0.45rem;line-height: 0.45rem;margin:0.4rem 5.3% 0;}
.layer{width: 100%;height: 100%;z-index: 100;position: fixed;top: 0;left: 0;display: block;background: #000;opacity: 0.4;}
.remindContent{position: absolute;margin: 0 13.9%;background:#fff;border-radius: 0.12rem;z-index: 666;top:1.68rem;
width:72.3%;text-align: center;}
.remind-txt{font-size: 0.16rem;line-height: 0.22rem;padding:0.23rem 0.24rem;border-bottom: 0.01rem solid #eaeaea;}
#reconfirm{font-size: 0.17rem;color: #0060F1;line-height: 0.24rem;height: 0.24rem;padding:0.12rem 0;}
</style>

