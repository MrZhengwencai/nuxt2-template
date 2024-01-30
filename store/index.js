export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  // server最开始执行的函数,client端不会执行(组件初始化之前可以拿到HCP操作)
  // 作用:拿到上下文,获取用户信息 cookie
  // { context, commit, state, req }
  async nuxtServerInit({ commit, dispatch, state }, { req }) {
  },
}


