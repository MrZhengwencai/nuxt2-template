<template>
  <div class="uploadImage">
    <el-upload
      ref="uploadElImage"
      list-type="picture-card"
      action
      :before-upload="beforeUpload"
      :http-request="Upload"
      :accept="accept"
      :show-file-list="true"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :limit="limit"
      multiple
      v-bind="$attrs"
      v-on="$listeners"
    >
      <!-- <el-button v-if="!$slots.default" slot="trigger" size="small" type="primary">
        {{ buttonText }}
      </el-button>
      <slot v-else /> -->
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-image v-if="value" :style="style" :src="blob || value" :preview-src-list="[blob || value]" fit="contain">
      <div slot="placeholder" class="image-slot">加载中</div>
    </el-image>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <p class="upload_tips">最多上传{{ limit }}张，支持{{ acceptDesc }}格式，大小不超过{{ fileSize }}M</p>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import OSS from 'ali-oss'
export default {
  name: 'UploadImage',
  components: {},
  props: {
    accept: {
      type: String,
      default: 'jpg,jpeg,png,gif',
    },
    acceptDesc: {
      type: String,
      default: ' jpeg、jpg、png ',
    },
    value: {
      type: String,
      required: '',
    },
    height: {
      type: String,
      default: '100px',
    },
    width: {
      type: String,
      default: '100px',
    },
    onError: {
      type: Function,
      required: false,
    },
    // 默认5mb大小
    fileSize: {
      type: Number,
      default: 5,
    },
    // 数量限制
    limit: {
      type: Number,
      default: 10,
    },
    onSuccess: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      blob: null,
      newAction: '',
      ossClient: null, // oss客户端实例
      bucket: 'ihome_bucket_name_customer', // bucket名称(后端去oss创建)
      region: 'oss-cn-shenzhen', // oss服务区域名称
      AccessKeyId: '',
      AccessKeySecret: '',
      SecurityToken: '',
      dialogImageUrl: '',
      dialogVisible: false,
      measureImage: [], //最终的所有图片
    }
  },
  computed: {
    style() {
      const { height, width } = this
      return {
        height,
        width,
      }
    },
    buttonText() {
      return this.value ? '覆盖已有图片' : '选择图片'
    },
  },
  watch: {
    value: {
      handler(val) {
        this.blob = val
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    // URL.revokeObjectURL(this.blob);
    this.blob = null
  },
  // 服务端在mounted去实例化！反之可能导致相关api获取不到
  mounted() {
    this.getOssConfig()
    console.log('this.limit', this.limit)
  },
  methods: {
    getOssConfig() {
      this.$api.common.getOSSConfig().then((res) => {
        // console.log("getOSS", res);
        const { accessKeyId, accessKeySecret, bucketName, endpoint, securityToken } = res.result
        this.AccessKeyId = accessKeyId
        this.AccessKeySecret = accessKeySecret
        this.SecurityToken = securityToken
        this.bucket = process.env.OSS_BUCKETNAME
      })
    },
    //  创建oss client
    initOSSClient() {
      this.ossClient = new OSS({
        accessKeyId: this.AccessKeyId,
        accessKeySecret: this.AccessKeySecret,
        bucket: this.bucket,
        region: this.region,
        stsToken: this.SecurityToken,
      })
    },
    Upload(file) {
      const that = this
      async function putObject() {
        if (!that.ossClient) {
          await that.initOSSClient()
        }
        const fileName = Date.parse(new Date()) + '-' + file.file.name
        that.ossClient
          .multipartUpload(`${fileName}`, file.file, {
            progress(p) {
              console.log('onProgress', file)
              // 获取进度条的值
              file.onProgress({
                percent: parseInt(p * 100),
              })
            },
          })
          .then((result) => {
            console.log('上传成功!!!', result, result.url)
            result.url = result.res.requestUrls[0].split('?')[0]
            that.blob = result.url
            // that.value = result.url;
            // that.$emit('input', result.url)
            // that.$emit('fileInfo', result)
            // that.$emit('getUploadImage', result.url)
            file.onSuccess(result)
          })
          .catch((err) => {
            console.log('err:', err)
          })
      }
      putObject()
    },
    // 上传前的检查
    beforeUpload(file) {
      console.log('上传前的检查', file)
      // 存在上传动作，可以进行emit
      this.isInit = false
      // 记录上传的数量
      // this.patchUploadFileNum++;
      console.log('上传的文件', file)
      const isLt5M = file.size / 1024 / 1024 <= this.fileSize
      if (!isLt5M) {
        this.$message.error(`上传文件大小不能超过${this.fileSize}MB!`)
        return Promise.reject()
      }
      const tmpcnt = file.name.lastIndexOf('.')
      const exname = file.name.substring(tmpcnt + 1)
      let names = this.accept
      names = names.split(',')
      console.log('后缀', names.indexOf(exname.toLowerCase()))
      if (names.indexOf(exname.toLowerCase()) < 0) {
        // names.toString()
        this.$message.error(`仅支持上传${this.acceptDesc}格式文件！`)
        return Promise.reject()
      }
      return Promise.resolve()
    },
    handleUploadError(err, file, fileList) {
      console.log('上传失败')
      if (typeof this.onError === 'function') {
        this.onError(err, file, fileList)
      } else {
        this.$message.error('上传失败')
      }
    },
    handleUploadSuccess(response, file, fileList) {
      console.log('上传成功-response', response, file, fileList)
      // this.$emit('input', response)
      // this.blob = URL.createObjectURL(file.raw);
      if (typeof this.onSuccess === 'function') {
        this.onSuccess(response, file, fileList)
      } else {
      }
      // 文件存储
      const index = this.getIndexByUid(this.measureImage, file)
      if (index === -1) {
        this.measureImage.push(file)
      } else {
        this.measureImage[index] = file
      }
      this.measureImage = this.measureImage.filter((item) => {
        // 添加响应式属性
        this.editName && this.$set(item, 'prefixName', this.splitFileName(item.name))
        return ['error', 'removed'].indexOf(item.status) === -1
      })
      console.log('this.measureImage', this.measureImage)
    },
    // 截取文件名
    splitFileName(text) {
      const index = text.lastIndexOf('.')
      return text.substr(0, index)
    },
    // 获得文件索引
    getIndexByUid(arr, item) {
      for (const i in arr) {
        if (item.uid === arr[i].uid) {
          return i
        }
      }
      return -1
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      const _url = URL.createObjectURL(file.raw)
      let curIndex
      this.measureImage.forEach((item, i) => {
        if (item.uid === file.uid) {
          curIndex = i
        }
      })
      if (curIndex !== undefined) {
        this.measureImage.splice(curIndex, 1)
      }
      console.log(_url, '移除文件', file, fileList, this.measureImage)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，一共选择了 ${files.length + fileList.length} 个文件`,
      )
    },
    handlerClearImage() {
      this.measureImage = []
    },
  },
}
</script>

<style lang="scss" scoped>
.uploadImage {
  // width: 100px;
  // height: 100px;
  // position: relative;
  .upload_tips {
    margin-top: 10px;
    font-size: 12px;
    color: #999999;
  }
  /deep/ .el-upload--picture-card {
    width: 80px;
    height: 80px;
    border: 1px solid rgb(192, 204, 218);
  }
  /deep/ .el-icon-plus {
    top: 50%;
    transform: translateY(-100%);
  }
  /deep/ .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
/deep/ .el-dialog__wrapper {
  z-index: 2000;
}
</style>
<style lang="scss">
/deep/ .v-modal {
  z-index: 2000 !important;
}
.el-dialog__wrapper {
  z-index: 2000;
}
</style>
