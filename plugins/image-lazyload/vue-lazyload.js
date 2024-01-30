/*
 * @Description:图片懒加载
 * @LastEditors: hyman
 * @LastEditTime: 2022-01-06 18:05:45
 */
import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
// Vue.use(VueLazyLoad);
Vue.use(VueLazyLoad, {
  // preLoad: 1.3,
  error: require('@/assets/images/common/break.jpg'),
  loading: require('@/assets/images/common/loadBackground.jpg'),
  // attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: ['scroll']
})
