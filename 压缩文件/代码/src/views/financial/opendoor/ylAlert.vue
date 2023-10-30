<template>
  <div class="eventAlert">
    <div class="a_main">
      <p class="a_title" v-show="errTitle!=''">{{errTitle}}</p>
      <p class="a_msg" v-show="errMsg!=''">{{errMsg}}</p>
      <p class="a_errCode" v-show="errCode!=''">ERROR:{{errCode}}</p>
      <span class="a_btn" @click="closeAlert">确认</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: "eventAlert",
    props: ["errTitle", "errMsg", "errCode"],
    methods: {
      closeAlert() {
        this.$emit("closeAlert");
      }
    }
  }
</script>
<style scoped>
  .eventAlert {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    left: 0;
    top: 0;
    text-align: center;
  }

  .a_main {
    width: 70%;
    border-radius: 0.05rem;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    padding-top: 0.1rem;
  }

  .a_title {
    font-size: 0.18rem;
    color: #333;
    padding: 0 0.1rem;
    box-sizing: border-box;
  }

  .a_msg {
    font-size: 0.16rem;
    color: #333;
    padding: 0.1rem 0.1rem;
    box-sizing: border-box;
  }

  .a_errCode {
    font-size: 0.12rem;
    color: #999;
    padding: 0 0.1rem;
    box-sizing: border-box;
  }

  .a_btn {
    display: block;
    font-size: 0.18rem;
    line-height: 0.45rem;
    height: 0.45rem;
    color: #0085d2;
    border-top: 0.01rem solid #C1C7D3;
    margin-top: 0.1rem;
  }

</style>
