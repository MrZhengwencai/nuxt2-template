/*
 * @Description:错误监控组件
 */
import Vue from 'vue'
const errorBoundary = Vue => {
  Vue.component('ErrorBoundary', {
    data: () => ({ error: null }),
    errorCaptured(err, vm, info) {
      this.error = `${err.stack}\n\nfound in ${info} of component`
      // SentryCapture(err, 1) //异常上报到sentry
      return false
    },
    render() {
      return (this.$slots.default || [null])[0] || null
    }
  })
}

// 全局注册errorBoundary
Vue.use(errorBoundary)