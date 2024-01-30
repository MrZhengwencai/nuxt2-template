<template>
  <div class="nav-header-container" :class="{'nav-scroll': isShowBg}" @click.stop>
    <div class="main-content" :style="{ width: isIndex ? '16.1rem' : '14rem' }">
      <div class="left-wrap">
        <img class="logo-img logo1-img" src="~/assets/images/common/logo.png" alt="" @click="handleLogo()" />
        <img class="logo-img logo2-img" src="~/assets/images/common/logo2.png" alt=""  @click="handleLogo()" />
        <ul class="nav-list">
          <li v-for="(item, index) in navList" :key="index">
            <template v-if="item.list">
              <span>{{ item.title }}</span>
              <img class="arrow-down" src="~/assets/images/common/arrow-down.png" alt="">
              <img class="arrow-down-a" src="~/assets/images/common/arrow-down-a.png" alt="">
              <div class="modal-wrap">
                <div class="itme-wrap" v-for="(cItem, cIndex) in item.list" :key="cIndex" :style="{paddingLeft: cItem.paddingLeft}">
                  <img :style="{height: cItem.imgHeight}" :src="cItem.img" alt="">
                  <ul class="text-list">
                    <li>{{ cItem.title }}</li>
                    <li v-for="(dItem, dIndex) in cItem.list" :key="dIndex" @click="handleNav(dItem)">{{ dItem.title }}</li>
                  </ul>
                </div>
              </div>
            </template>
            <span v-else @click="handleNav(item)">{{ item.title }}</span>
          </li>
        </ul>
      </div>
      <div class="right-wrap">
        <div class="phone">
          <img src="~/assets/images/common/phone.png" alt="">
          <span>400-6116-720</span>
        </div>
        <div class="search-wrap">
          <img src="~/assets/images/common/search.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const isIndex = this.$route.path === '/'
    return {
      isShowBg: false, // 显示背景色
      isIndex, // 是否是首页
      navList: [
        {
          title: '首页',
          url: '/'
        },
        {
          title: '产品',
          list: [
            {
              title: '咨询',
              img: require('~/assets/images/common/nav-modal1.png'),
              paddingLeft: '0.25rem',
              list: [
                {
                  title: '新商业模式咨询规划',
                  url: '/consultPlan'
                },
                {
                  title: '智能制造精益生产',
                  url: '/leanProduce'
                },
              ]
            },
            {
              title: '系统',
              img: require('~/assets/images/common/nav-modal2.png'),
              paddingLeft: '0.5rem',
              list: [
                {
                  title: '数字化营销系统',
                  url: '/digitalMarket'
                },
                {
                  title: '数字化运营系统',
                  url: '/digitalOperation'
                },
                {
                  title: '数字化生产系统',
                  url: '/digitalProduce'
                },
                {
                  title: '数字化交付系统',
                  url: '/digitalDelivery'
                },
              ]
            },
            {
              title: '能力',
              img: require('~/assets/images/common/nav-modal3.png'),
              paddingLeft: '0.6rem',
              imgHeight: '0.4rem',
              list: [
                {
                  title: '渠道招商'
                },
                {
                  title: '终端运营',
                  url: '/terminalOperation'
                },
                {
                  title: '整案产研',
                  url: '/productionResearch'
                },
                {
                  title: '展厅设计',
                  url: '/showHall'
                },
                {
                  title: '工厂技改',
                  url: '/factoryChange'
                },
                {
                  title: '定制交付',
                  url: '/customDelivery'
                },
              ]
            },
          ]
        },
        {
          title: '行业方案',
          list: [
            {
              title: '行业',
              img: require('~/assets/images/common/nav-modal4.png'),
              paddingLeft: '0.44rem',
              list: [
                {
                  title: '门墙柜行业',
                  url: '/doorWall'
                },
                {
                  title: '板材行业',
                  url: '/panelTrade'
                },
                {
                  title: '装修行业'
                },
                {
                  title: '智能家居行业'
                },
                {
                  title: '卫浴行业'
                },
                {
                  title: '铝门窗行业'
                },
              ]
            }
          ]
        },
        {
          title: '客户案例',
        },
        {
          title: '服务市场',
          url: 'http://zcloud-market.i72.com'
        },
        {
          title: '关于至爱',
          list: [
            {
              title: '关于',
              img: require('~/assets/images/common/nav-modal5.png'),
              paddingLeft: '0.4rem',
              list: [
                {
                  title: '企业介绍'
                },
                {
                  title: '最新资讯'
                }
              ]
            }
          ]
        }
      ]
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
  mounted() {
    window.addEventListener('scroll', this.setIsShowBg)
  },
  beforeDestory() {
    window.removeEventListener('scroll', this.setIsShowBg)
  },
  methods: {
    setIsShowBg(e) {
      // 滚动条位置
      var x = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.isShowBg = x > 0;
    },
    // 点击导航跳转
    handleNav(data) {
      if(data.url) {
        if(data.url.includes('http')) {
          const newUrl = data.url.replace('http', 'https');
          window.open(newUrl);
          return;
        }
        this.$router.push(data.url)
      }
    },
    handleLogo() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.05rem;
  z-index: 99;
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    .logo1-img {
      display: none !important;
    }
    .logo2-img {
      display: block !important;
    }
  }
  &.nav-scroll {
    background-color: rgba(0, 0, 0, 0.7);
    height: 0.75rem;
    .main-content {
      padding-top: 0.05rem;
    }
    .logo1-img {
      display: none !important;
    }
    .logo2-img {
      display: block !important;
    }
  }
  .main-content {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.35rem;
    box-sizing: border-box;
    .left-wrap {
      display: flex;
      align-items: center;
      .logo-img {
        width: 1.43rem;
        height: 0.48rem;
        margin-right: 1.3rem;
        cursor: pointer;
      }
      .logo1-img {
        display: block;
      }
      .logo2-img {
        display: none;
      }
      .nav-list {
        display: flex;
        align-items: center;
        &>li {
          height: 0.7rem;
          padding: 0 0.4rem 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          &:hover {
            span {
              color: #dfc307;
            }
            .arrow-down {
              display: none;
            }
            .arrow-down-a {
              display: block;
            }
            .modal-wrap {
              display: flex;
            }
          }
          span {
            display: inline-block;
            line-height: 1;
            font-size: 0.18rem;
            color: #fff;
          }
          &>img {
            width: 0.12rem;
            margin-left: 0.04rem;
            // margin-top: 0.04rem;
          }
          .arrow-down {
            display: block;
          }
          .arrow-down-a {
            display: none;
            transform: rotate(180deg);
          }
          .modal-wrap {
            display: none;
            background-color: #fff;
            color: #222;
            position: absolute;
            top: 0.7rem;
            left: -0.7rem;
            z-index: 99;
            box-shadow: 0 6px 12px rgba(51,51,51,.2);
            .itme-wrap {
              font-size: 0.16rem;
              width: 2.82rem;
              height: 3.60rem;
              display: flex;
              border-right: 1px solid #d0d0d0;
              padding: 0.4rem 0 0 0;
              &:last-of-type {
                border-right: none
              }
              img {
                height: 0.36rem;
                margin-right: 0.2rem;
              }
              .text-list {
                li {
                  font-size: 0.16rem;
                  line-height: 1;
                  margin-bottom: 0.2rem;
                  color: #666;
                  cursor: pointer;
                  &:hover {
                    color: #222;
                    font-weight: bold;
                  }
                  &:last-of-type {
                    margin-bottom: 0;
                  }
                  &:first-of-type {
                    color: #222;
                    line-height: 0.36rem;
                    font-size: 0.18rem;
                    font-weight: bold;
                    margin-bottom: 0.24rem;
                  }
                }
              }
            }
          }
        }
      }
    }
    .right-wrap {
      display: flex;
      align-items: center;
      .phone {
        display: flex;
        align-items: center;
        font-size: 0.18rem;
        color: #fff;
        img {
          width: 0.26rem;
          height: 0.26rem;
          display: block;
          margin-right: 0.08rem;
        }
      }
      .search-wrap {
        margin-left: 0.5rem;
        display: none;
        img {
          width: 0.16rem;
          height: 0.16rem;
        }
      }
    }
  }
}
</style>
