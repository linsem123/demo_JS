<template>
  <div>
    <!-- 头部 -->
    <top-head
     @go-back="goBack()"
    :show_back="true"
    >
      <div slot="left"></div>
      <div slot="main">我的订单</div>
      <div slot="right"></div>
    </top-head>
    <!-- 头部 -->


    <div class="main">
      <ul class="order-type-filter">
        <li v-for="order_type in order_type_status" :key="order_type.typeId" :class="{'active':order_type.typeId == current_order_type}" >
          <p class="tag"  @click="selectOrderType(order_type.typeId)">{{order_type.typeName}}</p>
          <span class="tag-number" v-if="order_status_count[''+order_type.typeId].all_count>0">{{order_status_count[order_type.typeId].all_count}}</span>
        </li>
      </ul>
        <ul class="order-status-filter" v-show="current_order_type_status">
          <li v-show="order_status.canFilter" v-for="order_status in current_order_type_status.status" :key="order_status.statusKey" :class="{'active':order_status.statusKey == current_order_status}" >
            <p class="tag" :class="order_status_count[current_order_type][order_status.statusKey]&&order_status_count[current_order_type][order_status.statusKey].count>0?'has_count':''" @click="selectOrderStatus(order_status.statusKey)">{{ order_status.statusName }}</p>
          </li>
        </ul>
      <div  v-if="order_list && order_list.length > 0">
        
        <mt-loadmore style="min-height:calc(100vh - 3.84rem);" :top-method="loadTop" :auto-fill="true" ref="loadmore">
          <ul class="order-list">

            <!-- 即时提货 -->
              <template v-if="current_order_type == 1" >
              <li class="order" v-for="(order,index) in order_list" :key="order.order_id">
                <div class="order-status text-right"> 
                  <span class="order-status-label" :class="order.order_status_code === 'await_pay'?'yellow':(order.order_status_code === 'finished'?'red':'')"> {{order.order_status_code | renderStatus(current_order_type_status) }} </span></i>
                </div>
                <ul class="goods-list"  @click="redirect(`/my/order/${order.order_id}`)">
                  <li class="goods clearfix" v-for="goods in order.goods_list" :key="goods.goods_id">
                    <img alt="" class="goods-cover" v-lazy="{src: goods.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                    <div class="goods-info">
                      <h1 class="goods-name"> {{goods.name}} </h1>
                      <p>
                        <span class="goods-price"> {{goods.formated_shop_price}} </span>
                        <span class="goods-number"> x{{goods.goods_number}} </span>
                      </p>
                    </div>
                  </li> 
                </ul>
                <p class="total text-right">
                  <span>共{{order.goods_list?order.goods_list.length:""}}件商品</span>&nbsp;&nbsp;<span>实付款:{{order.total_fee}}</span>
                </p>
                <div class="action clearfix">
                  <p class="text-right" v-if="order.order_status_code === 'shipped'">
                    <!-- <a href="javascript:;" class="btn" @click="checkShip(order.order_id);">查看物流</a> -->
                    <a href="javascript:;" class="btn yellow-color" @click="confirmOrder(order.order_id,index);">确认收货</a>
                  </p>
                  <p class="text-right" v-if="order.order_status_code === 'await_pay'">
                    <a href="javascript:;" class="btn" @click="cancelOrder(order.order_id,index);">取消订单</a>
                    <a href="javascript:;" class="btn yellow-color" @click="payOrder(order.order_id,index);">立即付款</a>
                  </p>
                  <p class="text-right" v-if="order.order_status_code === 'finished'">
                    <a href="javascript:;" class="btn" @click="purchaseAgain(order);">再次购买</a>
                    <a v-if="!culIsCommented(order.goods_list)" href="javascript:;" class="btn yellow-color" @click="redirect(`/my/commentsdetail/${order.order_id}`)">去评价</a>
                    <a v-else href="javascript:;" class="btn yellow-color">已评价</a>
                  </p>
                </div>
              </li>
              </template>
            <!-- 即时提货 -->

            <!-- 存储 -->
              <!-- 1.存储中 2.已到期 3.提前结束 4.待付款 5.已取消（ecjia） 6.确认中 7.初始化(保留) -->
              <!-- ecjia的操作 -->
              <template v-if="current_order_type == 2 && (current_order_status =='await_pay'||current_order_status =='canceled')" >
                <li class="order" v-for="(order,index) in order_list" :key="order.order_id">
                  <div class="order-status text-right"> 
                    <span class="order-status-label" :class="order.order_status_code === 'await_pay'?'yellow':(order.order_status_code === 'finished'?'red':'')"> {{order.order_status_code | renderStatus(current_order_type_status) }} </span></i>
                  </div>
                  <ul class="goods-list"  @click="redirect(`/my/order/${order.order_id}`)">
                    <li class="goods clearfix" v-for="goods in order.goods_list" :key="goods.goods_id">
                      <img alt="" class="goods-cover" v-lazy="{src: goods.img.thumb, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                      <div class="goods-info">
                        <h1 class="goods-name"> {{goods.name}} </h1>
                        <p>
                          <span class="goods-price"> {{goods.formated_shop_price}} </span>
                          <span class="goods-number"> x{{goods.goods_number}} </span>
                        </p>
                      </div>
                    </li> 
                  </ul>
                  <p class="total text-right">
                    <span>共{{order.goods_list?order.goods_list.length:""}}件商品</span>&nbsp;&nbsp;<span>实付款:{{order.total_fee}}</span>
                  </p>
                  <div class="action clearfix">
                    <p class="text-right" v-if="order.order_status_code === 'await_pay'">
                      <a href="javascript:;" class="btn" @click="cancelOrder(order.order_id,index);">取消订单</a>
                      <a href="javascript:;" class="btn yellow-color" @click="payOrder(order.order_id,index);">立即付款</a>
                    </p>
                  </div>
                </li>
              </template>
              <!-- ecjia的操作 -->

              <!-- 后台的操作 -->
              <template v-else-if="current_order_type == 2">
                <li class="order" v-for="(order,index) in order_list" :key="order.id">
                  <div class="order-status" v-if="order.status == 1"> 
                    <span class="order-status-datetime">存储日期:{{order.createTime}}</span>
                    <span class="order-status-label  float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <div class="order-status" v-if="order.status == 2"> 
                    <span class="order-status-datetime">到期日期:{{order.calInterestStopTime}}</span>
                    <span class="order-status-label  float-right red"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                   <div class="order-status" v-if="order.status == 3"> 
                    <span class="order-status-datetime">到期日期:{{order.calInterestStopTime}}</span>
                    <span class="order-status-label  float-right red"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <div class="order-status" v-if="order.status == 4"> 
                    <span class="order-status-interest">下单可获赠{{order.interest}}克黄金</span>
                    <span class="order-status-label  float-right yellow"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <div class="order-status" v-if="order.status == 5"> 
                    <span class="order-status-interest"></span>
                    <span class="order-status-label  float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <div class="order-status" v-if="order.status == 6"> 
                    <span class="order-status-interest">存储日期:{{order.createTime}}</span>
                    <span class="order-status-label  float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <!-- <div class="order-status" v-if="order.status == 5"> 
                    <span class="order-status-label  float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div> -->
                  <ul class="goods-list"  @click="redirect(`/my/order/deposit/${order.id}`)">
                    <li class="goods clearfix" v-for="goods in order.details" :key="goods.goodsId">
                      <img alt="" class="goods-cover" v-lazy="{src: goods.url, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                      <div class="goods-info">
                        <h1 class="goods-name"> {{goods.goodsName}} </h1>
                        <p>
                          <!-- <span class="goods-price"> {{goods.weigh}}克 </span> -->
                          <span class="goods-number"> x{{goods.quantity}} </span>
                        </p>
                      </div>
                    </li> 
                  </ul>
                  <template v-if="order.status == 1">
                    <p class="total text-right">
                      <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span>合计克重:{{order.weigh}}</span>
                    </p>
                    <div class="action clearfix">
                      <p>
                        <select v-model="order.willDo" @change="selectWillDo(order.willDo,order.id)">
                          <!-- 1.代存 2.寄存 3.回购 -->
                          <option value="1">到期后自动转为待办</option>
                          <!-- <option value="2">到期后自动续期</option> -->
                          <!-- <option value="3">到期后自动回购</option> -->
                        </select>
                        <i class="float-right iconfont icon-more"></i>
                      </p>
                    </div>
                  </template>
                  <template v-if="order.status == 2">
                    <p class="total">
                      <span v-if="order.interestUnit==1">赠送金:{{order.interest}}克</span>
                      <span v-else>赠送金:{{order.interest}}元</span>
                      <span>
                        <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span class="float-right">合计克重:{{order.weigh}}</span>
                      </span>
                    </p>
                  </template>
                  <template v-if="order.status == 3">
                    <p class="total text-right">
                      <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span class="float-right">合计克重:{{order.weigh}}</span>
                    </p>
                  </template>
                  <template v-if="order.status == 4">
                    <p class="total text-right">
                      <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span>待付款:{{order.rawInfo.formatedTotalFee}}</span>
                    </p>
                    <div class="action clearfix">
                      <p class="text-right">
                        <a href="javascript:;" class="btn" @click="cancelOrder(order.rawInfo.orderId,index);">取消订单</a>
                        <a href="javascript:;" class="btn yellow-color" @click="payOrder(order.rawInfo.orderId,index);">立即付款</a>
                      </p>
                    </div>
                  </template>
                  <template v-if="order.status == 5">
                    <p class="total text-right">
                      <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span class="float-right">合计克重:{{order.weigh}}</span>
                    </p>
                  </template>
                  <template v-if="order.status == 6">
                    <p class="total text-right">
                      <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span class="float-right">合计克重:{{order.weigh}}</span>
                    </p>
                  </template>
                </li>
              </template>
              <!-- 后台的操作 -->
            <!-- 存储 -->

            <!-- 回购 -->
              <template v-if="current_order_type == 3" >
                <!-- 1.待确认 2.已确认 3.已取消 -->
                <li class="order" v-for="(order,index) in order_list" :key="order.id">
                  <div class="order-status text-right" v-if="order.status == 1"> 
                    <span class="order-status-label yellow"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <div class="order-status" v-if="order.status == 2"> 
                    <span class="order-status-datetime">回购日期:{{order.createTime}}</span>
                    <span class="order-status-label float-right red"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <div class="order-status" v-if="order.status == 3"> 
                    <span class="order-status-datetime">回购日期:{{order.createTime}}</span>
                    <span class="order-status-label float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <ul class="goods-list"  @click="redirect(`/my/order/buyback/${order.id}`)">
                    <li class="goods clearfix" v-for="goods in order.details" :key="goods.goodsId">
                      <img alt="" class="goods-cover" v-lazy="{src: goods.url, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                      <div class="goods-info">
                        <h1 class="goods-name"> {{goods.goodsName}} </h1>
                        <p>
                          <span class="goods-number"> x{{goods.quantity}} </span>
                        </p>
                      </div>
                    </li> 
                  </ul>
                  <p class="total">
                    <span>合计克重:{{order.weigh}}</span>&nbsp;&nbsp;<span class="float-right">合计回购金额:{{order.amount}}</span>
                  </p>
                  <div class="action clearfix">
                    <p class="text-right" v-if="order.status == 1">
                      <a href="javascript:;" class="btn" @click="cancelBuyback(order.id,index);">取消回购</a>
                      <a href="javascript:;" class="btn yellow-color" @click="confirmBuyback(order.id,index);">确认回购</a>
                    </p>
                  </div>
                </li>
              </template>
            <!-- 回购 -->

            <!-- 存储提货 -->
              <!-- 1.待付款2.待发货3.待收货4.已完成5.交易关闭 -->
              <template v-if="current_order_type == 4" >
                <li class="order" v-for="(order,index) in order_list" :key="order.id">
                  <div class="order-status">  
                    <span class="order-status-datetime">提货日期:{{order.createTime}}</span>
                    <span v-if="order.status == 1" class="order-status-label float-right yellow"> {{order.status | renderStatus(current_order_type_status) }} </span>
                    <span v-if="order.status == 2" class="order-status-label float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                    <span v-if="order.status == 3" class="order-status-label float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                    <span v-if="order.status == 4" class="order-status-label float-right red"> {{order.status | renderStatus(current_order_type_status) }} </span>
                    <span v-if="order.status == 5" class="order-status-label float-right"> {{order.status | renderStatus(current_order_type_status) }} </span>
                  </div>
                  <ul class="goods-list"  @click="redirect(`/my/order/delivery/${order.id}`)">
                    <li class="goods clearfix" v-for="goods in order.details" :key="goods.goodsId">
                      <img alt="" class="goods-cover" v-lazy="{src: goods.url, loading:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtZWNsaXBzZSIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMiAwIDAgMSAzMCA1MCIgZmlsbD0iI2ZmYjYwNiIgdHJhbnNmb3JtPSJyb3RhdGUoMTI0LjU2OSA1MCA1MSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTE7MzYwIDUwIDUxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9wYXRoPjwvc3ZnPg=='}">
                      <div class="goods-info">
                        <h1 class="goods-name"> {{goods.goodsName}} </h1>
                        <p>
                          <span class="goods-number"> x{{goods.quantity}} </span>
                        </p>
                      </div>
                    </li> 
                  </ul>
                  <p class="total text-right">
                    <span>共{{order.details?order.details.length:""}}件商品</span>&nbsp;&nbsp;<span>合计克重:{{order.weigh}}</span>
                    <!-- <span>共{{order.quantity}}件商品</span>&nbsp;&nbsp;<span>合计克重:{{order.details | computeTotalWeight}}</span> -->
                  </p>
                  <div class="action clearfix">
                    <!-- 1.待付款 2.待发货 3.待收货 4.已完成 5.已取消 -->
                    <p class="text-right" v-if="order.status == 1">
                      <a href="javascript:;" class="btn" @click="cancelDepositDelivery(order.id,index);">取消提货</a>
                      <a href="javascript:;" class="btn yellow-color" @click="payDepositDelivery(order,index);">提货</a>
                    </p>
                    <p class="text-right" v-if="order.status == 3">
                      <a href="javascript:;" class="btn yellow-color" @click="confirmDepositDelivery(order.id,index);">确认收货</a>
                    </p>
                  </div>
                </li>
              </template>
            <!-- 存储提货 -->

          </ul>
          <div class="zhanwei"></div>
        </mt-loadmore>
        <!-- <div class="click-more" @click="getMore();">{{tip}}</div> -->
      </div>
      <div class="none-order" v-else>
        <p>没有相关记录</p>
        <a href="javascript:;" class="btn" @click="redirect(`/goods`);">立即购买金条，尊享财富保值</a>
      </div>
    </div>
  </div>
</template>

<script>
import topHead from "@/views/components/TopHead.vue";

import _ from 'lodash';

import { Toast,MessageBox,Loadmore } from "mint-ui";

import { order_type_status } from "@/assets/js/constants";

export default {
  components: {
    topHead:topHead,
    mtLoadmore:Loadmore,
  },
  data() {
    return {
      mall_token:"",
      tip: "查看更多",
      order_list: [],
      page_size: 50,
      page: 1,
      order_type_status: order_type_status,
      // metal_type:METAL_TYPE,
      current_order_type: "", //当前选中的订单类型
      current_order_status: "", //当前选中的订单状态


      default_order_status_count:{//订单状态个数
        "1":{//即时提货
          "all_count":0,
          "await_pay":{//待付款
            count:0,
          },
          "await_ship":{//待发货
            count:0,
          },
          "shipped":{//待收货
            count:0,
          },
        },
        "2":{//存储
          all_count:0,
          "6":{//6.确认中
            count:0,
          },
          "await_pay":{//待付款
            count:0,
          },
        },
        "3":{//回购
          all_count:0,
          "1":{//1.待确认
            count:0,
          },
        },
        "4":{//存储提货
          all_count:0,
          "2":{//1.待发货
            count:0,
          },
          "3":{//3.待收货
            count:0,
          },
        },
      },

      order_status_count:{//订单状态个数
        "1":{//即时提货
          "all_count":0,
          "await_pay":{//待付款
            count:0,
          },
          "await_ship":{//待发货
            count:0,
          },
          "shipped":{//待收货
            count:0,
          },
        },
        "2":{//存储
          all_count:0,
          "6":{//6.确认中
            count:0,
          },
          "await_pay":{//待付款
            count:0,
          },
        },
        "3":{//回购
          all_count:0,
          "1":{//1.待确认
            count:0,
          },
        },
        "4":{//存储提货
          all_count:0,
          "2":{//1.待发货
            count:0,
          },
          "3":{//3.待收货
            count:0,
          },
        },
      },

    };
  },
  filters:{
    computeTotalWeight(goods_list){
      let __weight = 0;
      goods_list.forEach( goods => {
        __weight = __weight + parseInt(goods.quantity) * parseFloat(goods.weigh);
      })
      return __weight;
    },
    renderStatus(order_status, current_order_type_status){
      let __list = current_order_type_status.status.filter( status => {
        return status.statusKey == order_status
      }), __statusName = '未知状态';

      if(__list && __list.length == 1){
        __statusName = __list[0].statusName
      }
      return __statusName;
    }
  },
  computed: {
    seller_id() {
      return this.$store.getters.getSellerId;
    },
    // mall_token() {
    //   return utils.storageGet("mall_token");
    // },
    current_order_type_status() {
      var tmp = this.order_type_status.filter(order_type => {
        return order_type.typeId == this.current_order_type;
      });
      return tmp.length == 1 ? tmp[0] : [];
    },
    location() {
      return this.$store.getters.getLocation;
    },
  },
  mounted() {
    // this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.init();
    })
  },
  methods: {
    init: function() {
      this.mall_token = utils.storageGet("mall_token");

      this.page = 1;
      this.order_list = [];
      this.current_order_type = Number(this.$route.params.order_type)
        ? Number(this.$route.params.order_type)
        : 1;
      this.current_order_status = this.$route.params.order_status
        ? this.$route.params.order_status
        : this.initCurrentOrderStatus();//如果是存储订单的话，默认是选中存储中;


      this.handleGetOrderList(
        this.current_order_type,
        this.current_order_status
      );

      this.initOrderCount();
      
    },

    initOrderCount:function(){
      this.order_status_count = _.merge(this.order_status_count,this.default_order_status_count);
      this.getOrderCount(()=>{
        this.getOrderstatusNumber()
      });
    },

    initCurrentOrderStatus:function(typeId){
      var status,
          typeId = typeId||this.current_order_type;
      switch(typeId){
        case 1://即使提货-全部
          status = "all";
          break;
        case 4://存储提货-待发货
          status = "2";
          break;
        default://其他-默认的1
          status = "1";
      }
      return status;
    },


    selectOrderType: function(typeId) {
      this.current_order_type = typeId;
      this.current_order_status = this.initCurrentOrderStatus(typeId);//如果是存储订单的话，默认是选中存储中
      this.handleGetOrderList(this.current_order_type, this.current_order_status);
    },
    selectOrderStatus: function(statusKey) {
      this.current_order_status = statusKey;
      this.handleGetOrderList(this.current_order_type, statusKey);
    },
    loadTop:function(){
      this.handleGetOrderList(
        this.current_order_type,
        this.current_order_status
      );
      
    },
    culIsCommented:function(order_list){
      let is_commented = false,
          num = 0;

      order_list.forEach(function(item){
        if(item.is_commented == 1){
          num += 1;
        }
      })

      if(num == order_list.length){
        is_commented = true;
      }
      return is_commented;
    },


/********************************获取订单列表/********************************/
    getInstanceDeliveryOrderList(order_status,ecjia_order_type,cb) {//获取即时提货、存储订单列表（ecjia）
      let data = {
        token: this.mall_token,
        order_type:ecjia_order_type||2,//0表示所有类型，1表示存储类型，2表示提货类型
        pagination: {
          count: 9999,
          page: 1
        }
      };

      if (order_status !== "all") {
        data.type = order_status;
      }

      utils.API.order_list({
        data: data
      })
      .then(res => {
        // this.order_list = [];
        this.order_list = res.model.data;
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        cb&&cb();
      })
      .catch(ret => {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      });
    },
    getDepositOrderList(order_status,cb) {//获取寄存（存储）列表
      let data = {
            status:"",
            pageId: 1, //{number} 当前页，page为空返回全部列表
            pageSize: 9999, //{number} 每页显示条数
          };

      if (order_status !== "all") {
        data.status = order_status;
      }

      utils.API.deposit_list({
        data:{
          token: this.mall_token,
          reqBody:data,
        },
      })
      .then(res => {
        this.order_list = res.model.items;
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      });
    },
    getBuybackOrderList(order_status,cb) {//获取回购订单列表
      let data = {
            status:"",
            type: 2,//1.利息回购 2.商品回购
            pageId: 1, //{number} 当前页，page为空返回全部列表
            pageSize: 9999, //{number} 每页显示条数
          };
      if (order_status !== "all") {
        data.status = order_status;
      }
      utils.API.buyback_list({
        data:{
          token: this.mall_token,
          reqBody:data,
        }
      })
      .then(res => {
        this.order_list = res.model.items;
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      });
    },
    getDepositDeliveryOrderList(order_status,cb) {//存储提货订单列表
      let data = {
            status:"",
            type: 2,//1.利息回购 2.商品回购
            pageId: 1, //{number} 当前页，page为空返回全部列表
            pageSize: 9999, //{number} 每页显示条数
          };
      if (order_status !== "all") {
        data.status = order_status;
      }

      utils.API.delivery_list({
         data:{
          token: this.mall_token,
          reqBody:data,
        }
      })
      .then(res => {
        this.order_list = res.model.items;
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
        cb&&cb();
      })
      .catch((ret)=> {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        this.$refs.loadmore&&this.$refs.loadmore.onTopLoaded();
      });
    },
    handleGetOrderList: function(order_type, order_status, cb) {
      let func = "",
          ecjia_order_type;

      switch (order_type) {
        case 1:
          func = "getInstanceDeliveryOrderList";//即时提货订单列表
          ecjia_order_type = 2;
          break;
        case 2:
          if(order_status == "await_pay" || order_status == "canceled"){//待付款和已取消的状态，获取ecjia的订单
            func = "getInstanceDeliveryOrderList";//即时提货订单列表
            ecjia_order_type = 1;
          }else{
            func = "getDepositOrderList";//存储（寄存）订单列表
          }
          break;
        case 3:
          func = "getBuybackOrderList";//回购订单列表
          break;
        case 4:
          func = "getDepositDeliveryOrderList";//存储提货订单列表
          break;
        default:
          this.$MessageBox.error("不正确的订单类型");
          return;
      }

      var para = [];

      if(order_status != undefined){
        para.push(order_status);
      }

      if(ecjia_order_type != undefined){
        para.push(ecjia_order_type);
      }

      if(cb != undefined){
        para.push(cb);
      }


      this[func].apply(this,para);
      
    },
/********************************获取订单列表/********************************/


/********************************按钮操作********************************/
  /**********即使提货、存储操作**********/
    confirmOrder: function(order_id, index) {//即使提货：确认收货(ecjia)
      var _this = this;
      utils.API.order_affirmReceived({
        //确认订单
        data: {
          token:this.mall_token,
          order_id: order_id
        }
      })
      .then(function(ret) {
        // console.log(ret);
        // location.href = ret.model.data.payment.pay_online;
        _this.getOrderDetail(order_id, function(detail) {
          if(_this.current_order_status == "all"){
            _this.order_list[index] = _.assign(_this.order_list[index], detail);
          }else{
            _this.order_list.splice(index,1);
          }
          Toast("收货成功！");
        });
        _this.initOrderCount();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
    cancelOrder: function(order_id,index) {//即时提货、存储：取消订单(ecjia)
      MessageBox({
        title: "",
        message: "确定取消此订单吗？",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          utils.API.order_cancel({
            //取消订单
            data: {
              token: this.mall_token,
              order_id: order_id
            }
          })
          .then(ret => {
            // var index = _.findIndex(this.order_list, {order_id: order_id});
            // if(index == -1){
            //   return;
            // }
            this.getOrderDetail(order_id, detail => {
              Toast("取消订单成功！");

              if(this.current_order_status == "all"){
                this.order_list[index] = _.assign(
                  this.order_list[index],
                  detail
                );
              }else{
                this.order_list.splice(index,1);
              }
            });
            this.initOrderCount();
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        }
      });
    },
    payOrder: function(order_id, index) {//即时提货、存储：去支付(ecjia)
      this.$router.push({ path: `/order/${order_id}/paymenttype` });
    },
  /**********即使提货、存储操作**********/
    
  /**********存储提货操作**********/
    cancelDepositDelivery:function(order_id,index){//存储提货：取消存储提货
      var me = this;

      MessageBox({
        title: "",
        message: "确定取消提货吗？",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          utils.API.delivery_cancel({
            //取消订单
            data: {
              token: me.mall_token,
              "reqBody":{
                id: order_id
              },
            }
          })
          .then(ret => {
            this.getDepositDeliveryOrderDetail(order_id, detail => {
              Toast("取消提货成功！");
              let index = _.findIndex(this.order_list, {id: order_id});
              if(index != -1){
                this.order_list.splice(index,1);
              }
              // this.order_list[index] = _.assign(
              //   this.order_list[index],
              //   detail
              // );
            });
            this.initOrderCount();
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        }
      });
    },
    payDepositDelivery:function(order,index){//存储提货：存储提货付款
      var me = this;

      if(order.expressFee <= 0){
        utils.API.fund_pay({
          data: {
            "token": me.mall_token,
            "reqBody":{
              id:order.id,
              channel:"alipay",
            },
          }
        })
        .then(function(ret) {
          me.getDepositDeliveryOrderDetail(order.id,function(detail){
            Toast("提货申请成功，请耐心等待发货！");
            let index = _.findIndex(me.order_list, {id: order.id});
            if(index != -1){
              me.order_list.splice(index,1);
            }
            // me.order_list[index] = _.assign(
            //   me.order_list[index],
            //   detail
            // );
          });
          me.initOrderCount();
        })
        .catch(function(ret) {
          !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
        });
      }else{
        this.$router.push({ path: `/my/todo/paymenttype/${order.id}`});
      }
    },
    confirmDepositDelivery:function(order_id,index){//存储提货：存储提货确认收货
      var _this = this;

      utils.API.delivery_confirm({
        data: {
          token: _this.mall_token,
          "reqBody":{
            id: order_id
          },
        }
      })
      .then(ret => {
        this.getDepositDeliveryOrderDetail(order_id, detail => {
          Toast("确认收货成功！");
          let index = _.findIndex(this.order_list, {id: order_id});
          if(index != -1){
            this.order_list.splice(index,1);
          }
          
          // this.order_list[index] = _.assign(
          //   this.order_list[index],
          //   detail
          // );
        });
        this.initOrderCount();
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },
  /**********存储提货操作**********/

  /**********回购操作**********/
    cancelBuyback:function(order_id,index){//回购：取消回购
      var me = this,
          data = {
            id:order_id,
          };
      MessageBox({
        title: "",
        message: "确认取消回购吗？",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          utils.API.buyback_cancel({
            data: {
              token: me.mall_token,
              "reqBody":data,
            }
          })
          .then(function(ret) {
            me.getBuybackOrderDetail(order_id,function(detail){
              Toast("取消回购成功！");
              let index = _.findIndex(me.order_list, {id: order_id});
              if(index != -1){
                me.order_list.splice(index,1);
              }
              // me.order_list[index] = _.assign(
              //   me.order_list[index],
              //   detail
              // );
            });
            me.initOrderCount();
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        }
      });
    },
    confirmBuyback:function(order_id,index){//回购：确认回购
      var me = this,
          data = {
            id:order_id,
          };
      MessageBox({
        title: "",
        message: "确认回购吗？",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          utils.API.buyback_confirm({
            data: {
              token: me.mall_token,
              "reqBody":data,
            }
          })
          .then(function(ret) {
            me.getBuybackOrderDetail(order_id,function(detail){
              Toast("确认回购成功！");
              let index = _.findIndex(me.order_list, {id: order_id});
              if(index != -1){
                me.order_list.splice(index,1);
              }
              // me.order_list[index] = _.assign(
              //   me.order_list[index],
              //   detail
              // );
            });
            me.initOrderCount();
            // me.$router.replace({ path:`/my/todo/payresult`});
          })
          .catch(function(ret) {
            !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
          });
        }
      });
    },
  /**********回购操作**********/
/********************************按钮操作********************************/


/********************************再次购买********************************/
  getCart(cb) {
    var _this = this;
    
    utils.API.cart_list({
      data: {
        token: _this.mall_token,
        seller_id: _this.seller_id,
        location: _this.location
      }
    })
    .then(function(ret) {
      // _this.cart = ret.model.data.cart_list[0]||{};
      cb&&cb(ret.model.data.cart_list[0]||{});
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },

  goodsInCart:function(goods_id,cart){
    if(!cart || !_.isArray(cart.goods_list)){
      return {};
    }
    var goods_in_cart = cart.goods_list.filter(function(goods) {
          return goods.goods_id == goods_id;
        })[0]||{};

    return goods_in_cart;
  },

  cartUpdate:function(rec_id,number){//更新商品到购物车
    var me = this;

    return new Promise(function(resolve, reject) {
      utils.API.cart_update({
        data: {
          token: me.mall_token,
          rec_id: rec_id,
          new_number: number,
          location: me.location
        }
      })
      .then(function(ret) {
        resolve(ret);
      })
      .catch(function(ret) {
        reject(ret);
        // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    })
  },
  cartCreate: function(goods){//添加商品到购物车
    var _this = this;

    return new Promise(function(resolve, reject) {
      utils.API.cart_create({
        data: {
          token: _this.mall_token,
          goods_id: goods.goods_id,
          number: goods.goods_number,
          location: _this.location
        }
      })
      .then(function(ret) {
        resolve(ret);
      })
      .catch(function(ret) {
        reject(ret);
        // !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    })
  },

  purchaseAgain:function(order){//再次购买
    var me = this;

    this.getCart(function(cart){
      var funs = [];
      // console.log(order.goods_list);
      order.goods_list.forEach(function(goods){
        
        var goodsInCart = me.goodsInCart(goods.goods_id,cart);
        if(!_.isEmpty(goodsInCart)){
          funs.push(me.cartUpdate(goodsInCart.rec_id,goodsInCart.goods_number+goods.goods_number));
        }else{
          funs.push(me.cartCreate(goods));
        }
      })

      Promise.all(funs)
      .then(function (res) {
        Toast("添加成功，请前往购物车查看！");
        me.$router.push({ path: `/order/cart` });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    })
  },
  gotoComment:function(order){//去评价

  },
/********************************再次购买********************************/



/********************************获取订单详情********************************/
  getOrderDetail: function(order_id, cb) {//获取ecjia订单详情
    var _this = this;
    utils.API.order_detail({
      //订单详情
      data: {
        token: _this.mall_token,
        order_id: order_id
      }
    })
      .then(function(ret) {
        cb && cb(ret.model.data);
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
  },
  getDepositOrderDetail:function(order_id,cb){//获取存储订单详情
    var _this = this;
    utils.API.deposit_detail({
      //订单详情
      data: {
        token: _this.mall_token,
        "reqBody":{
          id: order_id
        },
      }
    })
    .then(function(ret) {
      cb && cb(ret.model);
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },
  getDepositDeliveryOrderDetail:function(order_id,cb){//获取存储提货订单详情
    var _this = this;
    utils.API.delivery_detail({
      //订单详情
      data: {
        token: _this.mall_token,
        "reqBody":{
          id: order_id
        },
      }
    })
    .then(function(ret) {
      cb && cb(ret.model);
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },
  getBuybackOrderDetail:function(order_id,cb){//获取回购订单详情
    var _this = this;
    utils.API.buyback_detail({
      //订单详情
      data: {
        token: _this.mall_token,
        "reqBody":{
          id: order_id
        },
      }
    })
    .then(function(ret) {
      cb && cb(ret.model);
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },
/********************************获取订单详情********************************/

/********************************获取各种订单状态个数********************************/
  getOrderstatusNumber:function(cb){//获取后台订单状态个数
    var _this = this;
    utils.API.orderstatus_number({
      //订单详情
      data: {
        token: _this.mall_token,
        "reqBody":{
        },
      }
    })
    .then(function(ret) {
      // console.log(ret.model);
      _.forEach(_this.order_status_count,function(val,key){
        let data_obj;
        switch(key){
          case "2":
            data_obj = ret.model.deposit;//存储 2
            break;
          case "3":
            data_obj = ret.model.buyback;//回购 3
            break;
          case "4":
            data_obj = ret.model.delivery;//存储提货 4
            break;
        }

        _.forEach(_this.order_status_count[key],function(v,k){
          if(k != "all_count"){
            let res = _.find(data_obj,function(o){return o.status == k});
            if(res){
              _this.order_status_count[key][k].count += res.count;
              _this.order_status_count[key].all_count += res.count;
            }
          }
        });
      });

      cb&&cb();
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },
  getOrderCount:function(cb){//获取ecjia订单状态个数
    var _this = this;
    utils.API.order_count({
      //订单详情
      data: {
        token: _this.mall_token,
      }
    })
    .then(function(ret) {
      // console.log(ret.model);

      _.forEach(_this.order_status_count,function(val,key){
        let data_obj;
        switch(key){
          case "1":
            data_obj = ret.model.data.desposit;//提货 1
            break;
          case "2":
            data_obj = ret.model.data.storage;//存储 2
            break;
        }

        _.forEach(_this.order_status_count[key],function(v,k){
          if(k != "all_count"){
            let res = _.find(data_obj,function(o){return o.type == k});
            if(res){
              _this.order_status_count[key][k].count += res.count;
              _this.order_status_count[key].all_count += res.count;
            }
          }
        });
      });

      cb && cb();
    })
    .catch(function(ret) {
      !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
    });
  },
/********************************获取各种订单状态个数********************************/
    

    
    selectWillDo:function(value,order_id,cb){//设置到期后自动转为什么
      var me = this,
          data = {
            id:order_id,
            willDo:value,
          };
      
      utils.API.deposit_update({
        data: {
          token: me.mall_token,
          "reqBody":data,
        }
      })
      .then(function(ret) {

        me.getDepositOrderDetail(order_id,function(detail){
          Toast("设置成功！");
          let index = _.findIndex(me.order_list, {order_id: order_id});
          if(index == -1){
            return;
          }
          me.order_list[index] = _.assign(
            me.order_list[index],
            detail
          );
        });
      })
      .catch(function(ret) {
        !ret.__servererror__ && Toast(ret.errorMessage || "未知错误！");
      });
    },

    // getMore:function() {
    //   this.handleGetOrderList(this.current_order_type,this.current_order_status);
    // },
    goBack:function(){
      this.$router.goBack('/my')
    },
    redirect: function(path) {
      path ? this.$router.push({ path: path }) : this.$router.goBack();
    },
    
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.main {
  width: 100vw;
  height: calc(100vh - 2rem);
  margin-top: 1rem;
  overflow: auto;
  .order-type-filter {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    li {
      position: relative;
      &.active {
        color: #ffb606;
      }
      .tag-number {
        border: 1px solid @yellow;
        position: absolute;
        color: @yellow;
        border-radius: 50%;
        display: block;
        width: 0.28rem;
        height: 0.28rem;
        text-align: center;
        line-height: 0.28rem;
        top: 0.1rem;
        right: -0.28rem;
      }
    }
    .tag {
      height: 1rem;
      text-align: center;
      line-height: 1rem;
      font-size: 0.3rem;
    }
  }
  .order-status-filter {
    padding: 0 0.2rem;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    li {
      border: 0.02rem solid #ccc;
      text-align: center;
      line-height: 0.68rem;
      width: 1.52rem;
      height: 0.68rem;
      margin: 0 0.2rem 0.2rem 0;
      &.active {
        border: 0.02rem solid #ffb606;
        .tag {
          color: #ffb606;
        }
      }
    }
    .tag {
      font-size: 0.3rem;
      position: relative;
      &.has_count {
        &:after {
          content:"";
          display: block;
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0.24rem 0.24rem 0;
          border-color: transparent @yellow transparent transparent;
          top:-1px;
          right:-1px;
        }
      }
    }
  }
  .none-order {
    margin-top: 1.8rem;
    text-align: center;
    p {
    }
    .btn {
      display:block;
      margin:0.4rem auto;
      color:#333;
      border:0.02rem solid #333;
      width:4.1rem;
      height:0.9rem;
      line-height:0.9rem;
    }
  }
  .order-list {
    font-size: 0;
    .order {
      margin-top: 0.2rem;
      background: #fff;
      .order-status {
        padding: 0 0.2rem;
        font-size: 0.26rem;
        height:0.8rem;
        line-height:0.8rem;
        .order-status-label{
          &.yellow {
            color:@yellow;
          }
          &.red {
            color:@red;
          }
        }
        .order-status-datetime{
          float:left;
        }
        .separator {
          display: inline-block;
          width: 1px;
          margin: 0 0.18rem;
          color: #ccc;
        }
      }
      .goods-list {
        .goods {
          border-top: 0.02rem solid #eee;
          padding: 0.2rem;
          display: flex;
          .goods-cover {
            width: 2rem;
            height: 2rem;
            display: block;
            box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
          }
          .goods-info {
            width: 4.5rem;
            padding-left: 0.5rem;
            font-size: 0.26rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .goods-name {
              margin-bottom: 0.2rem;
              overflow: hidden;
              display: -webkit-box;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              word-wrap: break-word;
            }
            p {
              
            }
            .goods-price {
              color: @font-color-yellow;
              font-size:0.32rem;
            }
            .goods-number {
              float: right;
              font-size:0.28rem;
            }
          }
        }
      }
      .total {
        padding: 0.2rem;
        font-size: 0.26rem;
        color: #333;
        border-top: 0.02rem solid #eee;
        display: flex;
        justify-content:space-between;

        &.text-right {
          justify-content:flex-end;
        }
        span {
          margin:0 0.1rem;
        }
      }
      .action {
        background: #FFF;
        p {
          padding:0.2rem;
          border-top: 0.02rem solid #eee;
          font-size: 0.26rem;
          select {
            width: 90%;
            background: #ffffff;
            border: none;
            font-weight: bold;
          }
        }
        .btn {
          display: inline-block;
          text-align: center;
          width: 1.8rem;
          height: 0.6rem;
          line-height: 0.6rem;
          margin-left: 0.3rem;
          color: @font-color-yellow;
          border: 1px solid @font-color-yellow;
          border-radius: 0.4rem;
          &.yellow-color {
            background-color: @font-color-yellow;
            color: #fff;
          }
        }
      }
    }
  }
  .zhanwei {
    height:2.5rem;
  }
  .click-more {
    text-align: center;
    height: 2rem;
    margin: 20px 0;
    color: #ccc;
  }
}
</style>