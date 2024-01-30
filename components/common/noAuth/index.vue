<template>
  <div class="account-order">
    <img src="~/assets/images/common/noAuth.png" alt="暂无权限" />
  </div>
</template>
<script>
export default {
  name: 'NoAuth',
}
</script>
<style lang="scss" scoped>
.account-order {
  height: 656px;
  margin: 0 auto;
  position: relative;
  img {
    display: block;
    margin: 0 auto;
    // width: 300px;
    // height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
