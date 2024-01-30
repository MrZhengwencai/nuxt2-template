**使用方式**

# 整个接口名:网关域名+ (base:不用凭证 hcp 需要加上 base) + 网关应用名 + 实际的接口名

# asyncData/fetch 中

asyncData(ctx){
return ctx.app.$api.文件名.函数名({page: 99}).then(res=>{
return {
data: res.data
}
})
}

# mounted 中（注意此方法并不会进行服务端渲染）

mounted(){
this.$api.文件名.函数名({page: 99}).then(res=>{
this.data=res.data
})
}

# store 中

export const actions = {
GET_LIST({commit}){
return this.$api.文件名.函数名({page: 99}).then(res=>{
commit("xxx", res.data);
})
}
}
