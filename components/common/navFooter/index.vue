<template>
  <div class="nav-footer-container" :style="{ minWidth: isIndex ? '16.1rem' : '14rem' }">
    <!-- 咨询诊断 -->
    <section class="form-container" :style="{'background-image': `url(${imgBase}/form-bg.jpg)`}">
      <div class="main-width" :style="{ width: isIndex ? '16.1rem' : '14rem' }">
        <div class="title-wrap">
          <div class="title">咨询诊断，助力企业突破瓶颈持续增长</div>
          <div class="subtitle">留下您的联系方式，专属咨询顾问会快速联系您</div>
        </div>
        <el-form inline :model="formData" :rules="rules" ref="form" label-width="0" class="form-wrap-common" :class="isIndex ? 'form-wrap' : 'form-wrap-o'">
          <el-form-item prop="name">
            <el-input v-model="formData.name" placeholder="请输入您的姓名"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入您的电话"></el-input>
          </el-form-item>
          <el-form-item prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入您的公司名称"></el-input>
          </el-form-item>
          <el-button :loading="loading" @click="handleSubmit()" class="btn">提交需求</el-button>
          <el-form-item prop="checked" class="form-checked">
            <el-checkbox v-model="formData.checked">
              <span class="checked-span">阅读并接受</span>
              <a class="checked-a" href="https://www.i72.com/help/23" target="_blank">《个人信息授权及保护说明》</a>
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <!-- 底部信息 -->
    <div class="footer-cotnainer">
      <div class="nav-wrap" :style="{ width: isIndex ? '16.1rem' : '14rem' }">
        <ul class="left-wrap">
          <li v-for="(item, index) in navList" :key="index">
            <div class="title">{{ item.title }}</div>
            <div class="nav-item" v-for="(citem, cindex) in item.list" :key="cindex" @click="handleNav(citem)">{{ citem.title }}</div>
          </li>
        </ul>
        <div class="right-wrap">
          <div class="phone-time">
            <div class="box-wrap">
              <div class="tip-text">
                <img src="~/assets/images/common/phone-icon.png" alt="">
                咨询热线:
              </div>
              <div class="content-text">400-6116-720</div>
            </div>
            <div class="box-wrap">
              <div class="tip-text">
                <img src="~/assets/images/common/time-icon.png" alt="">
                咨询时间:
              </div>
              <div class="content-text">09:00-18:00&ensp;(周一至周六)</div>
            </div>
          </div>
          <div class="code-wrap">
            <img src="https://zashop-mini.i72.com/saasPortal/PC/common/qrcode.jpg" alt="至爱公众号二维码">
            <div>扫一扫咨询</div>
          </div>
        </div>
      </div>
      <div class="footer-wrap">
        <!-- 底部安全认证信息 -->
        <div class="floot_bottom">
          <ul class="bottom_cn" :style="{ width: isIndex ? '16.1rem' : '14rem' }">
            <li><a class="bottom_desc">广州至爱智家科技有限公司</a></li>
            <li><a class="bottom_desc" @click="open">营业执照</a></li>
            <li>
              <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602008533">
                <img src="~/assets/images/common/danghui_icon.png" />
                <p class="bottom_desc">粤公网安备 44010602008533号</p>
              </a>
            </li>
            <li>
              <a target="_blank" href="http://beian.miit.gov.cn">
                <img src="~/assets/images/common/icp_icon.png" />
                <p class="bottom_desc">粤ICP备18113120号</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible" width="800px">
      <div>
        <img style="width: 100%;object-fit: cover;" :src="business_license_img" fit="cover" lazy="true" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NavFooter',
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入您的电话'));
      }
      const phoneReg = /^1[0-9]{10}$/;
      if (!phoneReg.test(value)) {
        return callback(new Error('请输入正确的手机号码'));
      }
      callback();
    }
    const validChecked = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请选择《个人信息授权及保护说明》'));
      }
      callback();
    }

    const imgBase = 'https://zashop-mini.i72.com/saasPortal/PC/topic'
    return {
      imgBase,
      isIndex: false, // 是否是首页
      navList: [
        {
          title: '产品与服务',
          list: [
            { title: '咨询规划', url: '/consultPlan' },
            { title: '数字化系统', url: '/digitalMarket' },
            { title: '渠道招商' },
            {
              title: '整案产研',
              url: '/productionResearch'
            },
            { title: '展厅设计', url: '/showHall' },
            {
              title: '终端运营',
              url: '/terminalOperation'
            },
            { title: '工厂技改', url: '/factoryChange' },
          ]
        },
        {
          title: '行业方案',
          list: [
            { title: '门墙柜行业', url: '/doorWall' },
            { title: '装修行业' },
            { title: '卫浴行业' },
            { title: '板材行业', url: '/panelTrade'},
            { title: '智能家居行业' },
            { title: '铝门窗行业' },
          ]
        },
        {
          title: '客户案例',
          list: [
            { title: '标杆案例' },
            { title: '合作伙伴' },
          ]
        },
        {
          title: '关于至爱',
          list: [
            { title: '企业介绍' },
            { title: '最新资讯' },
          ]
        },
      ],
      dialogVisible: false,
      business_license_img: 'https://zashop-web.oss-cn-hangzhou.aliyuncs.com/images/common/business-license.jpg',
      // 表单
      loading: false,
      formData: {
        name: '',
        phone: '',
        remark: '',
        checked: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入您的姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入您的电话', trigger: 'blur' },
          { validator: validPhone, trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入您的公司名称', trigger: 'blur' },
        ],
        checked: [
          { validator: validChecked, trigger: 'change' },
        ],
      }
    }
  },
  watch: {
    '$route.path': {
      handler(nval) {
        this.isIndex = nval === '/'
      },
      deep: true
    }
  },
  methods: {
    // 点击导航跳转
    handleNav(data) {
      if(data.url) {
        this.$router.push(data.url)
      }
    },
    open() {
      this.dialogVisible = true
    },
    // 提交表单
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            ...this.formData,
          }
          this.$api.index.saveCustomer(params).then(res => {
            if(res && res.success) {
              this.resetForm();
              this.$message.success('提交成功')
            } else {
              this.$message.error(res.errorMessage || '提交失败')
            }
          }).finally(() => {
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-footer-container {
  .main-width {
    margin: 0 auto;
  }
  // 咨询诊断
  .form-container {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding-bottom: 1.4rem;
    .title-wrap {
      color: #fff;
      letter-spacing: 0.04rem;
      text-align: center;
      padding-top: 0.9rem;
      padding-bottom: 0.6rem;
      line-height: 1;
      .title {
        font-size: 0.42rem;
        margin-bottom: 0.24rem;
      }
      .subtitle {
        font-size: 0.24rem;
      }
    }
    .form-wrap-common {
      display: flex;
      justify-content: space-between;
      position: relative;
      /deep/ .el-form-item {
        margin-right: 0;
        .el-input__inner {
          height: 0.6rem;
          line-height: 0.6rem;
          font-size: 0.2rem;
        }
      }
      .btn {
        width: 2.55rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        padding: 0;
        border: none;
        background-color: #ffdb00;
        font-size: 0.2rem;
        color: #333;
      }
      .form-checked {
        position: absolute;
        bottom: -22px;
        left: 50%;
        transform: translate(-50%, 100%);
        /deep/ .el-form-item__content {
          width: auto !important;
          line-height: 0.4rem;
        }
        .checked-span {
          color: #fff;
        }
        .checked-a {
          color: #ffdb01;
        }
      }
    }
    .form-wrap {
      /deep/ .el-form-item {
        .el-form-item__content {
          width: 4.2rem;
          font-size: 0.2rem;
        }
      }
    }
    .form-wrap-o {
      /deep/ .el-form-item {
        .el-form-item__content {
          width: 3.5rem;
          font-size: 0.2rem;
        }
      }
    }
  }
  // 底部导航
  .footer-cotnainer {
    background-image: url('../../../assets/images/common/footer-bg.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .nav-wrap {
      margin: 0 auto;
      padding-top: 1rem;
      padding-bottom: 1.25rem;
      display: flex;
      justify-content: space-between;
      .left-wrap {
        display: flex;
        &>li {
          line-height: 1;
          letter-spacing: 1px;
          margin-right: 1.3rem;
          &:last-of-type {
            margin-right: 0;
          }
          .title {
            font-size: 0.18rem;
            margin-bottom: 0.26rem;
            color: #fff;
          }
          .nav-item {
            color: #b8b8b8;
            font-size: 0.14rem;
            margin-bottom: 0.16rem;
            cursor: pointer;
            &:hover {
              color: #dfc307;
              font-weight: bold;
            }
            &:last-of-type {
              margin-bottom: 0;
            }
          }
        }
      }
      .right-wrap {
        color: #fff;
        display: flex;
        .phone-time {
          padding-right: 2rem;
          position: relative;
          &::after {
            content: '';
            width: 1px;
            height: 1.7rem;
            background-color: rgba(255, 255, 255, 0.2);
            position: absolute;
            top: 0;
            right: 1rem;
          }
          .box-wrap {
            line-height: 1;
            margin-bottom: 0.6rem;
            &:last-of-type {
              margin-bottom: 0;
            }
            .tip-text {
              display: flex;
              align-items: center;
              font-size: 0.14rem;
              margin-bottom: 0.12rem;
              img {
                display: block;
                width: 0.16rem;
                height: 0.16rem;
                margin-right: 0.1rem;
              }
            }
            .content-text {
              font-size: 0.2rem;
            }
          }
        }
        .code-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #fff;
          font-size: 0.14rem;
          line-height: 1;
          img {
            width: 1.25rem;
            height: 1.25rem;
            display: block;
            margin-bottom: 0.18rem;
          }
        }
      }
    }
    .footer-wrap {
      height: auto;
      margin: 0 auto;
      border-top: 1px solid #7a7a7c;
      .floot_bottom {
        height: 0.5rem;
        display: flex;
        align-items: center;
      }
      .bottom_cn {
        margin: 0px auto;
        display: flex;
        color: #999999;
        font-size: 0.14rem;
        align-items: center;
        display: flex;
        justify-content: center;
      }
      .bottom_cn > li {
        padding: 0px 0.3rem;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        &:last-of-type {
          border-right: none;
        }
      }
      .bottom_cn > li > a {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .bottom_cn > li > a:hover {
        color: #ffffff;
      }
      .bottom_cn img {
        margin-right: 0.08rem;
        height: 0.18rem;
      }
      .bottom_desc {
        color: #999;
      }
    }
  }
}
</style>
