/*
 * @Description: 下载附件(附件是链接而非文件流)
 */
import Vue from 'vue'
import axios from 'axios'

function handleDownload(item) {
  if (!item) return
  let link = document.createElement('a')
  axios.get(item, { responseType: 'blob' }).then(({ data }) => {
    let blob = new Blob([data])
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = item.split('/').pop()
    link.click()
  })
}

const download = Vue.directive('download', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      const { value } = binding
      if (value instanceof Array) {
        value.forEach(item => {
          handleDownload(item)
        })
      }
      else {
        Vue.prototype.$message({
          type: 'warning',
          center: true,
          message: '请传入数组,例如:格式 [1,2,3]',
        })
      }
    })
  }
})

export default download
