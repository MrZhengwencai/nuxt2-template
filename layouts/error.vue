<template>
  <div class="container">
    <div v-if="error.statusCode === 404" class="page">
      <nuxt-link to="/">
        <img src="~/assets/images/common/notFound.png" alt="404" />
      </nuxt-link>
    </div>
    <div v-else class="page">
      <nuxt-link to="/">
        <img src="~/assets/images/common/serverError.png" alt="500" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  props: ['error'],
}
</script>

<style lang="scss" scoped>
.page {
  height: 470px;
  img {
    padding-top: 60px;
    display: block;
    margin: 0 auto;
  }
}
</style>
