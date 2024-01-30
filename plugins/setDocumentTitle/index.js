import Vue from 'vue'

const setTitle = {
    install(Vue, options) {
        Vue.prototype.$setDocumentTitle = function (val) {
            if (!val) console.error('请设置页面标题title属性')
            document.title = val
        }
    }
}

Vue.use(setTitle)