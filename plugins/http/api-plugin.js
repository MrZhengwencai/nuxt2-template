7/*
 * @Description:axios二次处理
 * @LastEditors: ChenPeiLin
 * @LastEditTime: 2021-01-27 14:44:48
 */
//文档: https://www.nuxtjs.cn/guide/plugins
import apis from "@/api/index";
export default (ctx, inject) => {
  var apiObject = {};
  for (var i in apis) {
    apiObject[i] = apis[i](ctx.$axios);
  }
  //inject:注入到服务端context, vue实例, vuex中
  inject("api", apiObject);
};
