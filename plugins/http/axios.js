/**
* @Description:axios二次封装
*/
import Vue from "vue";
export default function ({ $axios, redirect, store, app, route, error }, inject) {
  let axios = $axios;
  axios.defaults.headers = {
    "Content-Type": "application/json; charset=utf-8",
    "sysCode": "mallSiteApi",
    'x-requested-with': 'XMLHttpRequest',
  }
  axios.defaults.withCredentials = true;
  // 基础路径
  axios.defaults.baseURL = process.env.MALL_PATH
  // 请求回调
  axios.onRequest(config => {
    // console.log("axios config", config, config.data);
    // if (store.state.zhiaiHCP) {
    //   // 设置token,cookie-universal-nuxt将对象绑定在app对象上了,nuxtInitServer周期可以拿到
    //   config.headers["HCP"] = store.state.zhiaiHCP
    // }
    return config
  })

  // 返回回调
  axios.onResponse(async res => {
    if (!res.data.success) {
      // 如果是用户上下文不存在,重定向登录
      if (res.data.errorCode && res.data.errorCode === -5) {
        if (process.client) {
        }
      }
      if (res.data.errorCode != 0 && res.data.errorCode != 1) {
        Vue.prototype.$message({
          type: 'error',
          center: true,
          message: res.data.errorMessage,
        })
      }
      return res.data || "接口error";
    } else {
      return res.data
    }
  })

  // 错误回调
  axios.onError(err => {
    console.log(err, "err-错误回调-check!");
    if (process.client) {
      //处理浏览器端接口异常
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 500:
            Vue.prototype.$message({
              type: 'error',
              message: '接口500: ${err.response.data.message},请与管理员确认!',
            })
            break;
          case 404:
            Vue.prototype.$message({
              type: 'error',
              message: `接口404未找到: ${err.response.data.message},请与管理员确认!`,
            })
            break;
          case 400:
            Vue.prototype.$message({
              type: 'error',
              message: `状态码${err.response.status}: 请重新登录`,
            })
            break;
          // 401网关异常拦截
          case 401:
            console.log(`状态码${err.response.status}: 请重新登录`, route.path)
            Vue.prototype.$message({
              type: 'warning',
              message: `请重新登录`,
            })
            // 如果购物车是到处调用 这里考虑做下处理免得有些页面需要跳登录一直跳
            // redirect('/login')
            break;
          default:
            Vue.prototype.$message({
              type: 'error',
              message: `状态码${err.response.status}: ${err.response.data.message},请与管理员确认!`,
            })
            break;
        }
      }
      else {
        console.log(err, "err1");
      }
    } else {
      //处理服务器端接口异常
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            //layout/error.vue
            //加载error页面
            return error({ statusCode: 404 });
            break;
        }
      }
      else {
        console.log(err, "err2");
      }
    }
  })
}
