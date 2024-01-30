<template>
  <div class="address-dialog">
    <el-dialog title="选择地区" :visible.sync="showAddress" width="540px" center :before-close="handleClose">
      <div class="address">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <!-- 收货人 -->
          <el-form-item prop="consignee" label="收货人" label-width="70px" key="1" v-if="showDetail">
            <el-input
              placeholder="请输入收货人"
              maxlength="8"
              v-model="ruleForm.consignee"
              @input="onInput()"
            ></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item prop="phone" label="手机号码" label-width="70px" key="3" v-if="showDetail">
            <el-input placeholder="请输入手机号码" v-model="ruleForm.phone" @input="onInput()"></el-input>
          </el-form-item>
          <!-- 所在地址-收货地址控件 -->
          <el-form-item prop="provinces" label="所在地址" label-width="70px">
            <div class="address-cascader">
              <address-cascader
                v-if="showAddress"
                ref="addressCascader"
                :isClear="false"
                :placeDataType="requireArea"
                @getareamessage="handleChangeAddress"
              />
            </div>
          </el-form-item>
          <!-- 详细地址 -->
          <el-form-item prop="detailAddress" label="详细地址" label-width="70px" key="2" v-if="showDetail">
            <el-input
              placeholder="请输入详细地址"
              maxlength="100"
              v-model="ruleForm.detailAddress"
              @input="onInput()"
            ></el-input>
          </el-form-item>
          <!-- 默认地址 -->
          <el-form-item
            class="default-flag"
            prop="defaultFlag"
            label=""
            label-width="70px"
            key="4"
            v-if="showDefaultAddressSet"
            style="margin: 0 0 -18px 14px"
          >
            <el-checkbox v-model="ruleForm.defaultFlag" @input="onInput()">设为默认地址</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ensure(false)">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AddressCascader from '~/components/common/addressCascader/addressCascader'
import { mapState as mapRootState, mapActions as mapRootActions } from 'vuex'
export default {
  name: 'SelectAddress',

  props: {
    showAddress: {
      type: Boolean,
      default: false,
    },
    // 展示其他细节
    showDetail: {
      type: Boolean,
      default: true,
    },
    // 是否显示区
    showCountry: {
      type: Boolean,
      default: false,
    },
    // 默认地址设置
    showDefaultAddressSet: {
      type: Boolean,
      default: false,
    },
    // 用来回显的省市区Code-addressData
    // 传入的数据格式
    // {
    //     consignee: null,
    //     provinceName: null,
    //     cityName: null,
    //     districtName: null,
    //     provinceCode: null,
    //     cityCode: null,
    //     districtCode: null,
    //     detailAddress: null,
    //     phone: null,
    //     defaultFlag: "true/false",
    //   }
    areaCode: {
      type: [Array, Object],
      default: () => {},
    },
  },

  components: {
    AddressCascader,
  },

  data() {
    var validateConsignee = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入收货人!'))
      } else {
        callback()
      }
    }
    var validateProvinces = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择省市区!'))
      } else {
        callback()
      }
    }
    var validateDetailedAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入详细地址!'))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码!'))
      } else {
        // const reg = /^1[0-9]{10,10}$/
        const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('手机号码输入有误,请重新输入!'))
        }
      }
    }
    return {
      ruleForm: {
        consignee: '',
        provinces: [],
        detailAddress: '',
        phone: '',
      },
      rules: {
        consignee: [{ validator: validateConsignee, trigger: 'blur' }], //收货人
        provinces: [{ validator: validateProvinces, trigger: 'blur' }], //收货地址
        detailAddress: [{ validator: validateDetailedAddress, trigger: 'blur' }], //详细地址
        phone: [{ validator: validatePhone, trigger: 'blur' }], //手机号
      },
      value: [],
      dialogVisible: true,
      provincesParams: {},
      requireArea: [],
      selectArea: {}, //所选地区信息集合
    }
  },

  created() {
    if (this.showCountry) {
      this.requireArea = ['province', 'city', 'region']
    } else {
      this.requireArea = ['province', 'city']
    }
  },

  methods: {
    initArea() {
      console.log('this.selectArea-init', this.selectArea)
      this.$nextTick(() => {
        if (this.selectArea.districtCode) {
          this.$refs['addressCascader'].setAreaVal([
            this.selectArea.provinceCode,
            this.selectArea.cityCode,
            this.selectArea.districtCode,
          ])
        } else {
          this.$refs['addressCascader'].setAreaVal([this.selectArea.provinceCode, this.selectArea.cityCode])
        }
      })
    },
    handleClose(done) {
      this.ensure(false)
    },
    ensure(value) {
      this.$emit('hideDialog', value)
    },
    submitForm(formName) {
      if (JSON.stringify(this.selectArea) == '{}') {
        this.$message({
          message: '请选择地址',
          type: 'warning',
        })
        return
      }
      this.$refs[formName].validate(async (valid) => {
        console.log(valid, this.selectArea, 'this.ruleForm', this.ruleForm)
        if (valid) {
          const newParams = {
            ...this.selectArea,
            ...this.ruleForm,
          }
          this.$emit('ensureAddress', { ...newParams })
          return true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleChangeAddress(data) {
      if (data.length > 0) {
        this.selectArea.provinceCode = data[0].regionCode
        this.selectArea.provinceName = data[0].regionName
        if (data[1] && data[1].regionCode) {
          this.selectArea.cityCode = data[1].regionCode
          this.selectArea.cityName = data[1].regionName
        } else {
          this.selectArea.cityCode = 'unlimited'
          this.selectArea.cityName = '全部'
        }
        if (data[2] && data[2].regionCode) {
          this.selectArea.districtCode = data[2].regionCode
          this.selectArea.districtName = data[2].regionName
        } else {
          this.selectArea.districtCode = 'unlimited'
          this.selectArea.districtName = '全部'
        }
      } else {
        this.selectArea.provinceCode = ''
        this.selectArea.provinceName = ''
        this.selectArea.cityCode = ''
        this.selectArea.cityName = ''
        this.selectArea.districtCode = ''
        this.selectArea.districtName = ''
      }
    },
    // 解决el-input不能输入问题
    onInput() {
      this.$forceUpdate()
    },
  },

  watch: {
    areaCode: {
      handler(newVal, oldVal) {
        // console.log(newVal, '监听areaCode')
        if (JSON.stringify(newVal) != '{}') {
          this.selectArea = {
            provinceCode: newVal.provinceCode, //省
            provinceName: newVal.provinceName,
            cityCode: newVal.cityCode, //市
            cityName: newVal.cityName,
          }
          if (newVal.districtCode) {
            this.selectArea.districtCode = newVal.districtCode //区
            this.selectArea.districtName = newVal.districtName
          }
          // 需要显示详细地址 才执行
          if (this.showCountry) {
            this.ruleForm['consignee'] = newVal.consignee
            this.ruleForm['detailAddress'] = newVal.detailAddress
            this.ruleForm['phone'] = newVal.phone
          }
          // 默认地址
          this.ruleForm['defaultFlag'] = newVal.defaultFlag ? true : false
        } else {
          this.selectArea = {}
          this.ruleForm['consignee'] = ''
          this.ruleForm['detailAddress'] = ''
          this.ruleForm['phone'] = ''
          this.ruleForm['defaultFlag'] = false
        }
      },
      immediate: true,
      deep: true,
    },
    showAddress: {
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal, this.selectArea)
        if (newVal) {
          if (JSON.stringify(this.selectArea) != '{}') {
            this.initArea()
          }
        }
      },
      // immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.address {
  width: 425px;
  margin: 0 auto;
}
/* 修改el-input */
/deep/ .el-dialog__title {
  font-weight: bold;
}
/deep/ .el-input input,
/deep/ .el-form-item__content {
  width: 330px;
  margin-left: 0 !important;
}
/deep/ .el-dialog {
  border-radius: 8px;
}
/deep/ .el-button--primary {
  color: rgb(96, 98, 102);
  background-color: rgb(243, 217, 35) !important;
  border-color: rgb(243, 217, 35);
}
/deep/ .el-dialog__headerbtn:focus .el-dialog__close,
/deep/ .el-dialog__headerbtn:hover .el-dialog__close {
  color: red;
}
/deep/ .el-button {
  padding: 12px 40px;
  color: #333;
}
/deep/ .el-button:focus,
/deep/ .el-button--default:hover {
  color: unset;
  background-color: unset;
  border-color: #ccc;
}
/deep/ .el-form-item {
  display: flex;
}
/deep/ .el-form-item__label {
  width: 88px !important;
}
/deep/ .el-form-item__label::before {
  content: '*';
  color: red;
  line-height: 16px;
}
/deep/ .el-input.is-active .el-input__inner,
/deep/ .el-input__inner:focus,
/deep/ .el-cascader .el-input .el-input__inner:focus,
/deep/ .el-cascader .el-input.is-focus .el-input__inner {
  border-color: rgb(255, 210, 0);
}
</style>
<style lang="scss">
.address-cascader {
  /deep/ .el-cascader-node.in-active-path,
  /deep/ .el-cascader-node.is-active,
  /deep/ .el-cascader-node.is-selectable.in-checked-path {
    color: #333 !important;
  }
}
</style>
