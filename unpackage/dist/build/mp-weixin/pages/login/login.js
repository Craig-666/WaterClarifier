(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/login"],{"64c7":function(e,n,t){"use strict";t.d(n,"b",(function(){return r})),t.d(n,"c",(function(){return o})),t.d(n,"a",(function(){return u}));var u={uForm:function(){return t.e("node-modules/uview-ui/components/u-form/u-form").then(t.bind(null,"9ac6"))},uFormItem:function(){return Promise.all([t.e("common/vendor"),t.e("node-modules/uview-ui/components/u-form-item/u-form-item")]).then(t.bind(null,"e8f0"))},uInput:function(){return Promise.all([t.e("common/vendor"),t.e("node-modules/uview-ui/components/u-input/u-input")]).then(t.bind(null,"78b5"))},uButton:function(){return t.e("node-modules/uview-ui/components/u-button/u-button").then(t.bind(null,"1183"))}},r=function(){var e=this,n=e.$createElement;e._self._c},o=[]},"70e1":function(e,n,t){"use strict";t.r(n);var u=t("64c7"),r=t("c74c");for(var o in r)"default"!==o&&function(e){t.d(n,e,(function(){return r[e]}))}(o);t("8fa5");var i,a=t("f0c5"),c=Object(a["a"])(r["default"],u["b"],u["c"],!1,null,"457e0a1a",null,!1,u["a"],i);n["default"]=c.exports},"8fa5":function(e,n,t){"use strict";var u=t("c285"),r=t.n(u);r.a},a3c4:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var u=r(t("a34a"));function r(e){return e&&e.__esModule?e:{default:e}}function o(e,n,t,u,r,o,i){try{var a=e[o](i),c=a.value}catch(s){return void t(s)}a.done?n(c):Promise.resolve(c).then(u,r)}function i(e){return function(){var n=this,t=arguments;return new Promise((function(u,r){var i=e.apply(n,t);function a(e){o(i,u,r,a,c,"next",e)}function c(e){o(i,u,r,a,c,"throw",e)}a(void 0)}))}}var a={data:function(){return{form:{username:"",password:""},rules:{username:[{required:!0,message:"请输入账号"}],password:[{required:!0,message:"请输入密码"}]}}},methods:{login:function(){var n=this;this.$refs.uForm.validate(function(){var t=i(u.default.mark((function t(r){var o,i,a,c;return u.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!r){t.next=14;break}return o=n.form,i=o.username,a=o.password,t.prev=2,t.next=5,n.$Bmob.User.login(i,a);case 5:c=t.sent,"admin"===c.user_type?e.redirectTo({url:"/pages/index/index"}):e.redirectTo({url:"/pages/emp_index/orders"}),t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](2),e.showToast({icon:"none",title:"登录失败，请检查账号密码是否正确"});case 12:t.next=15;break;case 14:console.log("验证失败");case 15:case"end":return t.stop()}}),t,null,[[2,9]])})));return function(e){return t.apply(this,arguments)}}())}},onReady:function(){this.$refs.uForm.setRules(this.rules)},onLoad:function(){console.log(this.dayjs().valueOf())}};n.default=a}).call(this,t("543d")["default"])},c285:function(e,n,t){},c74c:function(e,n,t){"use strict";t.r(n);var u=t("a3c4"),r=t.n(u);for(var o in u)"default"!==o&&function(e){t.d(n,e,(function(){return u[e]}))}(o);n["default"]=r.a},d1c0:function(e,n,t){"use strict";(function(e){t("66ef");u(t("66fd"));var n=u(t("70e1"));function u(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("543d")["createPage"])}},[["d1c0","common/runtime","common/vendor"]]]);