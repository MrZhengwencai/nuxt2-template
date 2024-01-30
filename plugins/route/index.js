
export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    next()
  })
  app.router.afterEach((to, from) => {
    window.scrollTo(0, 0);
  })
}


