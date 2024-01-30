<template>
  <!-- 倒计时组件 -->
  <div class="downTime-wrapper">
    <!-- 这里是显示还未结束时的内容，这里只是我这得布局，你可以随意。 -->
    <div class="time" v-if="!isShow">
      <!-- <span class="hour">{{ myDay }}</span> : -->
      <!-- <div class="hour">
        <span>{{ getDay1 }}{{ getDay2 }}</span>
      </div>
      <span class="dian">天</span>
      <div class="hour">
        <span>{{ getHours1 }}{{ getHours2 }}</span>
      </div>
      <span class="dian">时</span>
      <div class="minute">
        <span>{{ getMinutes1 }}{{ getMinutes2 }}</span>
      </div>
      <span class="dian">分</span>
      <div class="second">
        <span>{{ getSeconds1 }}{{ getSeconds2 }}</span>
      </div>
      <span class="dian">秒</span> -->
      {{ showTime }}
    </div>
    <!-- 这里是显示结束后的内容 -->
    <div class="end_time" v-else>抢购已结束</div>
  </div>
</template>

<script>
export default {
  name: 'CountDown',

  props: {
    // 接收父组件传递过来的参数,这里传了  结束时间 - 开始时间 - 结束后显示的内容
    endTime: {
      type: Number,
      default: 1,
    },
    startTime: {
      type: Number,
      default: 2,
    },
    endMsg: {
      type: String,
      default: '抢购已结束!',
    },
  },

  data() {
    return {
      isShow: false, // 控制显示结束或还未结束显示的内容
      clocker: '', // 结束后显示的内容
      timeObj: null, // 时间对象,下方会用到
      myDay: 0, // 我定义来接收计算出来的 天 的
      myHours: 0, // 我定义来接收计算出来的 小时 的
      myMinutes: 0, // 我定义来接收计算出来的 分钟 的
      mySeconds: 0, // 我定义来接收计算出来的 秒钟 的
    }
  },
  computed: {
    getDay1() {
      return this.myDay < 10 ? '' : parseInt((this.myDay % 100) / 10)
    },
    getDay2() {
      return parseInt(this.myDay % 10)
    },
    getHours1() {
      return this.myHours < 10 ? 0 : parseInt((this.myHours % 100) / 10)
    },
    getHours2() {
      return parseInt(this.myHours % 10)
    },
    getMinutes1() {
      return this.myMinutes < 10 ? 0 : parseInt((this.myMinutes % 100) / 10)
    },
    getMinutes2() {
      return parseInt(this.myMinutes % 10)
    },
    getSeconds1() {
      return this.mySeconds < 10 ? 0 : parseInt((this.mySeconds % 100) / 10)
    },
    getSeconds2() {
      return parseInt(this.mySeconds % 10)
    },
    showTime() {
      if (this.getDay1 || this.getDay2) {
        let showDay = `${this.getDay1}${this.getDay2}天`
        return `${showDay} ${this.getHours1}${this.getHours2}:${this.getMinutes1}${this.getMinutes2}:${this.getSeconds1}${this.getSeconds2}`
      }
      return `${this.getHours1}${this.getHours2}:${this.getMinutes1}${this.getMinutes2}:${this.getSeconds1}${this.getSeconds2}`
    },
  },
  watch: {
    endTime: {
      handler(newName, oldName) {
        this.option()
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    option() {
      let go = ''
      // 计算时间差
      let timeLag = (this.endTime - this.startTime) / 1000
      // 判断当前是否时分秒的值是否大于10
      const add = (num) => {
        return num < 10 ? '0' + num : num
      }
      // 时间倒计时运算的方法
      const timeFunction = () => {
        const time = timeLag--
        this.timeObj = {
          // 时间对象
          seconds: Math.floor(time % 60),
          minutes: Math.floor(time / 60) % 60,
          hours: Math.floor(time / 60 / 60) % 24,
          days: Math.floor(time / 60 / 60 / 24),
        }
        // 计算出时分秒
        this.myDay = `${add(this.timeObj.days)}`
        this.myHours = `${add(this.timeObj.hours)}`
        this.myMinutes = `${add(this.timeObj.minutes)}`
        this.mySeconds = `${add(this.timeObj.seconds)}`
        // 当时间差小于等于0时,停止倒计时
        if (time <= 0) {
          this.isShow = true
          this.clocker = this.endMsg
          clearInterval(go)
        }
      }
      // 开始执行倒计时
      timeFunction()
      // 每一秒执行一次
      go = setInterval(() => {
        timeFunction()
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.downTime-wrapper {
  display: inline-block;
  height: 26px;
  line-height: 26px !important;
  width: 100%;
  letter-spacing: 1px;
  .dian {
    // font-weight: bold;
    position: relative;
  }
  .hour {
    display: inline-block;
    font-size: 16px;
    span {
      border-radius: 6px;
      color: #ffffff;
      display: inline-block;
    }
  }
  .minute {
    display: inline-block;
    font-size: 16px;
    span {
      border-radius: 6px;
      color: #ffffff;
      display: inline-block;
    }
  }
  .second {
    display: inline-block;
    font-size: 16px;
    margin-top: -5px;
    span {
      border-radius: 6px;
      color: #ffffff;
      display: inline-block;
    }
  }
  .end_time {
    text-align: right;
  }
  .downTime-wrapper__rushIcon {
    display: inline-block;
    width: 18px;
    height: 18px;
    position: relative;
    top: 14px;
    transform: translateY(-50%);
  }
}
</style>
