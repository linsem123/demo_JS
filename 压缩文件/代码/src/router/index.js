import Vue from 'vue'
import _ from 'lodash';
import Router from 'vue-router'

Vue.use(Router);

import enjoyLoan from './enjoyLoan';
import idUpdate from './idUpdate';
import lendCash from './lendCash';
import Login from './Login';
import entry from './entry';
import autostaging from './autostaging';
import cashInstalment from "./cashInstalment";
import consumeInstallment from "./consumeInstallment";
import installment from './installment';
import opendoor from './financial/opendoor';
import turnmoney from './financial/turnmoney';
import addcard from './financial/addcard';
import borrowedMoney from './borrowedMoney';
import sxf from './sxf';
import yindex from "./financial/yindex";   
const routes = _.concat(enjoyLoan,idUpdate,lendCash,Login,autostaging,cashInstalment,entry,consumeInstallment,installment,
borrowedMoney,opendoor,turnmoney,yindex,sxf,addcard);

export default new Router({
  routes
})