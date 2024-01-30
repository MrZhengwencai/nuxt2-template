<template>
  <div id="nuxt-default">
    <!-- <nav-header></nav-header> -->
    <nuxt />
    <!-- <nav-footer></nav-footer> -->
  </div>
</template>

<script>
import navHeader from '~/components/common/navHeader'
import navFooter from '~/components/common/navFooter'
import { seo } from '~/utils/assist/assist'
export default {
  components: {
    navHeader,
    navFooter
  },
  data() {
    return {
    }
  },
  mounted() {
    //直接将SEO脚本放在页面会被当成文本解析，所以将方法提取出来，放到mounted hook里面执行
    seo()
    //统计脚本
    const _hmt = _hmt || []
    ;(function () {
      var hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?02736a493e850835a7c343e9edd17e88'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })()
  },
}
</script>

<style lang="scss" scoped>
</style>
