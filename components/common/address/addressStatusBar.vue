<template>
  <div class="secion_li" @click="open">
    <div class="sectionLi_head">{{ title }}</div>
    <div class="secionLi_cn">
      <div class="receiverInfor_area">
        <p>{{ showAddress }}</p>
        <div class="receiverInfor_line"></div>
        <img src="~/assets/images/account/edit_icon.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showAddress: {
      type: String,
      default: () => '',
    },
    title: {
      type: String,
      default: () => '配送至',
    },
  },
  methods: {
    open() {
      this.$emit('showDialog', true)
    },
  },
}
</script>
<style lang="scss" scoped>
.secion_li {
  display: flex;
  align-items: center;
}
.sectionLi_head {
  font-size: 12px;
  color: #999;
  width: 74px;
  text-align: right;
}
.secionLi_cn {
  margin-left: 26px;
  font-size: 12px;
}
.receiverInfor_area {
  border: 1px solid #cccccc;
  height: 32px;
  display: flex;
  padding: 10px 16px;
  box-sizing: border-box;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;
}
.receiverInfor_line {
  height: 30px;
  width: 1px;
  background: #cccccc;
  margin: 0px 20px;
}
.receiverInfor_area > img {
  cursor: pointer;
  width: 14px;
}
</style>
