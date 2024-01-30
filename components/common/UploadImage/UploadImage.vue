<template>
  <el-row class="uploadBox upload-image-box" type="flex" justify="start" align="middle">
    <el-upload
      action
      :http-request="Upload"
      v-show="!isFull"
      class="upload"
      :multiple="multiple"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      v-bind="$attrs"
      :disabled="disabled"
      v-on="$listeners"
    >
      <i slot="default" class="el-icon-plus upload-icon" />
    </el-upload>
    <draggable v-model="measureImage" @start="drag = true" @end="drag = false">
      <span v-for="(img, index) in measureImage" :key="img.uid" class="content--imgBox">
        <template v-if="img.response">
          <img :src="img.response.url" class="content--img" />
          <el-row
            class="content--imgTools"
            type="flex"
            justify="end"
            @dblclick.native="
              () => {
                handleShowImg(index)
              }
            "
          >
            <i
              v-if="!disabled"
              class="el-icon-delete"
              @click="
                () => {
                  deleteImg(img, index)
                }
              "
            />
          </el-row>
          <el-input
            class="content--imgName"
            placeholder="默认文件名"
            size="mini"
            v-if="editName"
            v-model="img.prefixName"
          />
        </template>
        <div class="load-wrapper" v-else>
          <el-progress type="circle" :percentage="img.percentage" :width="80" class="loading" />
        </div>
      </span>
    </draggable>
    <preview-image ref="previewImage" :images="images" />
  </el-row>
</template>

<script>
import OSS from 'ali-oss'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'UploadImage',
  props: {
    // 允许上传的文件格式
    accept: {
      type: Array,
      default: () => ['jpg', 'jpeg', 'gif', 'png'],
    },
    // 批量上传
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 数量限制
    limit: {
      type: Number,
      default: 10,
    },
    // 默认5mb大小
    fileSize: {
      type: Number,
      default: 5,
    },
    editName: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Array, String],
      default: () => [],
    },
  },
  data() {
    return {
      measureImage: [],
      replaceSchedule: [],
      patchUploadFileNum: 0,
      ossClient: null, // oss客户端实例
      bucket: 'zacoreadmin', // bucket名称
      region: 'oss-cn-shenzhen', // oss服务区域名称
      AccessKeyId: '',
      AccessKeySecret: '',
      SecurityToken: '',
      isInit: true,
    }
  },
  computed: {
    images() {
      return this.measureImage
        .map((item) => {
          return item.response ? item.response.url : ''
        })
        .filter((item) => {
          return item
        })
    },
    isFull() {
      return this.measureImage.length >= this.limit
    },
    // true 简单数据格式，单张上传直接返回url字符串，批量上传返回url字符串列表
    // false 复杂数据格式，单张上传返回file对象，自行取值，批量上传返回file对象列表
    simple() {
      if (typeof this.value === 'string') {
        return true
      } else if (this.value instanceof Array) {
        return this.value.some((item) => {
          return typeof item === 'string'
        })
      }
      return false
    },
  },
  watch: {
    measureImage: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('measureImage', val)
        if (!this.isInit) {
          console.log('isInit')
          if (typeof this.value === 'string') {
            this.$emit('input', val[0] ? (val[0].response ? val[0].response.url : '') : '')
          } else if (this.value instanceof Array) {
            // 只有存在不是非初始化数据时才会emit
            this.simple
              ? this.$emit(
                  'input',
                  val.map((item) => {
                    if (item.response) {
                      return item.response.url
                    }
                  }),
                )
              : this.$emit('input', val)
            // }
          }
        }
      },
    },
  },
  mounted() {
    this.getOssConfig()
    this.initData(this.value)
  },
  methods: {
    getOssConfig() {
      frontPageAPI.getOSS().then((res) => {
        const { accessKeyId, accessKeySecret, bucketName, endpoint, stsToken } = res.result
        this.AccessKeyId = accessKeyId
        this.AccessKeySecret = accessKeySecret
        this.SecurityToken = stsToken
        this.bucket = bucketName
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
    initData(val) {
      if (this.hasVal(val)) {
        // 初始化的数据就不用出发emit函数
        this.isInit = true
        if (typeof this.value === 'string') {
          this.measureImage = [
            {
              uid: uuidv4(), // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
              name: this.splitFileName(val) || '', // 文件名
              status: 'success', // 状态有：uploading done error removed
              response: { status: 'success', url: val },
            },
          ]
        } else if (this.value instanceof Array) {
          if (this.simple) {
            this.measureImage = val.map((item) => {
              return {
                uid: uuidv4(), // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: this.splitFileName(item) || '', // 文件名
                status: 'success', // 状态有：uploading done error removed
                response: { status: 'success', url: item },
              }
            })
          } else {
            this.measureImage = val.map((item) => {
              return {
                uid: uuidv4(), // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: item.name || '', // 文件名
                prefixName: item.prefixName || this.splitFileName(item.name) || '', // 文件名
                status: 'success', // 状态有：uploading done error removed
                response: { status: 'success', url: item.url || '' },
              }
            })
          }
        }
      }
    },
    hasVal(value) {
      if (typeof value === 'string') {
        return !!value
      } else if (value instanceof Array) {
        return value && value.length > 0
      }
      return false
    },
    // 上传前的检查
    beforeUpload(file) {
      // 存在上传动作，可以进行emit
      this.isInit = false
      // 记录上传的数量
      // this.patchUploadFileNum++;
      console.log(file)
      const isLt5M = file.size / 1024 / 1024 <= this.fileSize
      if (!isLt5M) {
        this.$message.error(`上传文件大小不能超过${this.fileSize}MB!`)
        return Promise.reject()
      }
      const tmpcnt = file.name.lastIndexOf('.')
      const exname = file.name.substring(tmpcnt + 1)
      const names = this.accept
      if (names.indexOf(exname.toLowerCase()) < 0) {
        this.$message.error(`仅支持${names.join(',')}等类型的文件上传！`)
        return Promise.reject()
      }
      // console.log('this.measureImage.length', this.measureImage.length);
      if (this.measureImage.length >= this.limit) {
        this.$message.error(`最多支持${this.limit}个文件`)
        return Promise.reject()
      }
      return Promise.resolve()
    },
    // 自定义上传函数
    Upload(file) {
      const that = this
      async function putObject() {
        if (!that.ossClient) {
          await that.initOSSClient()
        }
        const fileName = Date.parse(new Date()) + '-' + file.file.name
        that.ossClient
          .multipartUpload(fileName, file.file, {
            progress(p) {
              console.log('onProgress', file)
              // 获取进度条的值
              file.onProgress({
                percent: parseInt(p * 100),
              })
            },
          })
          .then((result) => {
            // 在response 中添加上传得到的具体url
            result.url = result.res.requestUrls[0].split('?')[0]
            file.onSuccess(result)
          })
          .catch((err) => {
            that.$message.error('上传失败!')
            file.onError(err)
          })
      }
      putObject()
    },
    handleUploadError(err, file, fileList) {
      // 暂时不需要上传失败的逻辑
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (this.isFull) {
        this.$message.error(`最多支持${this.limit}个文件`)
        file.status = 'fail'
      } else {
        const index = this.getIndexByUid(this.measureImage, file)
        if (index === -1) {
          this.measureImage.push(file)
        } else {
          this.measureImage[index] = file
        }
      }
      this.measureImage = this.measureImage.filter((item) => {
        // 添加响应式属性
        this.editName && this.$set(item, 'prefixName', this.splitFileName(item.name))
        return ['error', 'removed'].indexOf(item.status) === -1
      })
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
    // 删除图片
    deleteImg(file, index) {
      this.isInit = false
      let curIndex
      this.measureImage.forEach((item, i) => {
        if (item.uid === file.uid) {
          curIndex = i
        }
      })
      if (curIndex !== undefined) {
        this.measureImage.splice(curIndex, 1)
      }
    },
    // 显示图片
    handleShowImg(index) {
      this.$refs.previewImage.show(index)
    },
  },
}
</script>

<style lang="scss" scoped>
$box-width: 100px;
.uploadBox {
  flex-wrap: wrap;
  .upload {
    margin-right: 8px;
    width: $box-width;
    height: $box-width;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    text-align: center;
    i {
      line-height: inherit;
    }
    .upload-icon {
      width: $box-width;
      height: $box-width;
      font-size: 30px;
      line-height: 84px;
      color: #8c939d;
    }
    .replace {
      display: inline-block;
      width: 0;
      height: 0;
    }
    .ant-upload {
      width: $box-width;
      height: $box-width;
      line-height: $box-width;
      .ant-upload-btn {
        display: inline-block;
      }
    }
  }
}
.content--imgBox {
  margin: 0 8px 0 0;
  position: relative;
  display: inline-block;
}
.content--imgBox .content--img,
.content--imgBox .load-wrapper {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: $box-width;
  height: $box-width;
  box-shadow: none;
  display: inline-block;
  position: relative;
  vertical-align: middle;
}
.content--imgBox .content--imgTools {
  display: none;
  left: 0;
  top: 0;
  position: absolute;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 0, 0, 0.65);
  border-radius: 6px;
  padding-right: 5px;
  width: $box-width;
  height: $box-width;
  font-size: 0;
  box-sizing: border-box;
}

.content--imgBox {
  .content--imgName {
    display: block;
    width: 100px;
    position: absolute;
  }
}

.content--imgBox:hover .content--imgTools {
  display: flex;
}

.content--imgBox i {
  font-size: 20px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: white;
  cursor: pointer;
}
.content--imgBox i::before {
  vertical-align: middle;
}
.load-wrapper .loading {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -40px 0 0 -40px;
}
</style>
<style lang="scss">
$box-width: 100px;
.upload-image-box {
  & > .upload {
    margin-bottom: 0;
  }
  .ant-upload-select-picture-card {
    display: block;
    width: $box-width;
    height: $box-width;
    margin: 0;
    & > .ant-upload {
      display: block;
      line-height: $box-width - 16px;
      box-sizing: border-box;
    }
    & > .rc-upload {
      line-height: $box-width;
    }
  }
}
</style>
