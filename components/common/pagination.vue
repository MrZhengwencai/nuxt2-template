<template>
  <div class="pagination">
    <div class="pagination-container">
      <el-pagination
        background
        :hide-on-single-page="hidePage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper,total"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      // 数据总条数
      type: Number,
      default: 1,
    },
    pageSize: {
      // 每条展示页数
      type: Number,
      default: 25,
    },
    // 不要在这里传参数
    currentPageNo: {
      // 当前页数
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      currentPage: 1,
      hidePage: false, //当只有一页时隐藏分页
    }
  },
  methods: {
    initPageNo() {
      this.currentPage = 1
    },
    // 每页展示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 当前页数变化
    handleCurrentChange(val) {
      this.$emit('pageChange', { pageIndex: val })
    },
  },
  // 列表页做联动需要
  watch: {
    currentPageNo(newVal, oldVal) {
      this.currentPage = newVal
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination {
  position: relative;
  .pagination-container {
    float: right;
  }
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ffe100 !important;
  color: #333 !important;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #333 !important;
}
/deep/ .el-pagination__total {
  margin-left: 8px;
}
</style>
