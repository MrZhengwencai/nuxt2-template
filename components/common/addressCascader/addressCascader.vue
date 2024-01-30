/* 区域级联组件用法介绍： 1.参数placeDataType为地区组件所需的类型，类型有：country、area、province、city、region、all;
类型可任意组合（如：国家、省份、城市或省份、城市、区域；但是至少以省份开始） 用法如--
:placeDataType="['area','province','city']"， ['area','province','city']： 表示这个组件是提供 区域 省 市的选择地区组件
华东区-广东省-广州市 ['province','city','region']：表示这个组件是提供 省 市 区的选择地区组件 广东省-广州市-天河区
比较特殊的是 “all”是在各个省或者市或者区县数据上插入全部选项 比如加入之后
广东省下面的区域就有【全部、广州、惠州、揭阳...】等， 此时如果用户选中广东省下面的全部就表示选中了广东省下面的所有市
2.获取选中数据方法：通过getareamessage事件来暴露选中的数据；数据以json形式返回，比如以地区开始，那返回数组的第一个为选中地区的信息，以此类推；
3.设置默认值方法：setAreaVal，按顺序传入对应的code值来设置默认值； 如// 设置省市区默认值 regionCode为对应的行政区划代码
this.$refs['areaclear'].setAreaVal([省regionCode, 市regionCode, 区县regionCode]) */
<template>
  <div class="l-area_input">
    <el-cascader
      popper-class="cascader"
      ref="areaCascaderInput"
      v-model="selectedOptions"
      :disabled="isDisable"
      :clearable="isClear"
      :options="options"
      :props="props"
      @change="handleChange"
      @active-item-change="handleItemChange"
    >
    </el-cascader>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    isDisable: {
      type: Boolean,
      default: false,
    },
    isClear: {
      type: Boolean,
      default: false,
    },
    placeDataType: {
      type: Array,
      required: true,
    },
    // 自动获取焦点
    needFocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      curareamessage: [],
      Cachedata: {},
      options: [],
      vals: [],
      props: {
        value: 'id',
        label: 'regionName',
        children: 'children',
      },
      selectedOptions: [],
      placeDataTypeLength: 0, // 传入数组的长度
      index1: 0,
      index2: 0,
      index3: 0,
      index4: 0,
      areaindex: '', // 地区索引
      provinceindex: '', // 省份索引
      cityindex: '', // 城市索引
      provinceID: '',
      cityID: '',
      regionceID: '',
      areaID: '',
    }
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('getareadata'))) {
      this.Cachedata = JSON.parse(sessionStorage.getItem('getareadata'))
    }
  },
  mounted() {
    if (this.IsInArray(this.placeDataType, 'country')) {
      // console.log(1)
      // this.getCountry() // 国家
    } else if (this.IsInArray(this.placeDataType, 'area')) {
      // console.log(2)
      // this.getArea() // 区域 华北 华东
    } else if (this.IsInArray(this.placeDataType, 'province')) {
      this.getProvince() // 省
      // console.log(3)
    } else if (this.IsInArray(this.placeDataType, 'city')) {
      console.error('不能只传入city,至少以省份开始') // 市
    } else if (this.IsInArray(this.placeDataType, 'region')) {
      console.error('不能只传入region,至少以省份开始') // 区
    }
    if (this.needFocus) {
      this.$refs.areaCascaderInput.handleFocus()
    }
  },
  methods: {
    ...mapActions('common', [
      'getByParentId', // 通过parentId查询 通过父级省/市的id 获取城市和区域
      'getListCountry', // 获取国家（暂不需要）
      'getlisyDistrict', // 通过国家id获取区域列表（暂不需要）
      'listProvinceByCountryId', // 通过国家id获取省列表
      'getProvinceByDistrictId', // 通过区域id获取省份（暂不需要）
      'getRegionByRegionCode', // 通过省市区行政区号查询对应的信息
      'getCountryByCode', // 通过国家code获取（暂不需要）
      'getDistrictByCode', // 通过区域code获取（暂不需要）
    ]),
    clearVal() {
      this.selectedOptions = []
      this.curareamessage = []
      this.$emit('getareamessage', this.curareamessage)
    },
    //  设置默认值
    async setAreaVal(data = []) {
      // console.log('data省市区级联', data)
      if (!data[0]) {
        console.error('地区组件的setAreaVal方法的参数不能为空')
        return false
      }
      const selectID = async () => {
        //  获取根据编码获取选中的ID
        switch (this.placeDataType[0]) {
          case 'country':
            if (this.IsInArray(this.placeDataType, 'country')) {
              //  获取国家id
              const countryRES = await this.getCountryByCode({
                key: data[0],
              }).then((res) => {
                return res.id
              })
              this.selectedOptions.push(countryRES)
            }
            if (this.IsInArray(this.placeDataType, 'area')) {
              //  获取地区id
              if (data[1]) {
                const areaRES = await this.getDistrictByCode({
                  key: data[1],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(areaRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'province')) {
              //  获取省份id
              if (data[2]) {
                const provinceRES = await this.getRegionByRegionCode({
                  regionCode: data[2],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(provinceRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'city')) {
              //  获取市id
              if (data[3]) {
                const cityRES = await this.getRegionByRegionCode({
                  regionCode: data[3],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(cityRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'region')) {
              //  获取市id
              if (data[4]) {
                const regionRES = await this.getRegionByRegionCode({
                  regionCode: data[4],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(regionRES)
              }
            }
            // this.selectedOptions = Array.from(new Set(this.selectedOptions))
            break
          case 'area':
            if (this.IsInArray(this.placeDataType, 'area')) {
              //  获取地区id
              if (data[0]) {
                const areaRES = await this.getDistrictByCode({
                  key: data[0],
                }).then((res) => {
                  // console.log('res===', res)
                  return res.id
                })
                this.selectedOptions.push(areaRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'province')) {
              //  获取省份id
              if (data[1]) {
                const provinceRES = await this.getRegionByRegionCode({
                  regionCode: data[1],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(provinceRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'city')) {
              //  获取市id
              if (data[2]) {
                const cityRES = await this.getRegionByRegionCode({
                  regionCode: data[2],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(cityRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'region')) {
              //  获取市id
              if (data[3]) {
                const regionRES = await this.getRegionByRegionCode({
                  regionCode: data[3],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(regionRES)
              }
            }
            // 华北区与河北省的id相同，去重之后导致数据缺失一个，回显出现问题
            // this.selectedOptions = Array.from(new Set(this.selectedOptions))
            break
          case 'province':
            if (this.IsInArray(this.placeDataType, 'province')) {
              //  获取省份id
              if (data[0]) {
                const provinceRES = await this.getRegionByRegionCode({
                  regionCode: data[0],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(provinceRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'city')) {
              //  获取市id
              if (data[1]) {
                const cityRES = await this.getRegionByRegionCode({
                  regionCode: data[1],
                }).then((res) => {
                  return res.id
                })
                this.selectedOptions.push(cityRES)
              }
            }
            if (this.IsInArray(this.placeDataType, 'region')) {
              //  获取市id
              if (data[2]) {
                const regionRES = await this.getRegionByRegionCode({
                  regionCode: data[2],
                }).then((res) => {
                  // console.log("res===",res)
                  return res.id
                })
                this.selectedOptions.push(regionRES)
              }
            }
            this.selectedOptions = Array.from(new Set(this.selectedOptions))
            break
        }
      }
      //  处理异步问题
      await selectID()
      //  获取对应数据列表
      switch (this.placeDataType[0]) {
        case 'country':
          this.getCountry().then(() => {
            this.options = this.clearRepetition(this.options)
            if (this.IsInArray(this.placeDataType, 'area')) {
              this.options[0].children = []
              //  是否显示全部
              if (this.IsInArray(this.placeDataType, 'all')) {
                this.options[0].children.unshift({
                  id: '',
                  regionCode: '',
                  regionName: '全部',
                })
              }
              this.getlisyDistrict({
                id: 1,
              }).then((res) => {
                res.forEach((item, i) => {
                  if (this.placeDataType.length > 2) {
                    this.options[0].children.push({
                      regionName: item.name,
                      children: [],
                      id: item.id,
                      regionCode: item.code,
                    })
                  } else {
                    this.options[0].children.push({
                      regionName: item.name,
                      id: item.id,
                      regionCode: item.code,
                    })
                  }
                })
                this.options[0].children = this.clearRepetition(this.options[0].children)
                // console.log('setVal地区设置', this.options[0].children)
                if (this.IsInArray(this.placeDataType, 'province')) {
                  for (let i = 0; i < res.length; i++) {
                    if (data[1] === res[i].code) {
                      //  存储当前的索引
                      if (this.IsInArray(this.placeDataType, 'all')) {
                        this.areaindex = i + 1
                        this.index2 = i + 1
                      } else {
                        this.areaindex = i
                        this.index2 = i
                      }
                      //  获取省份
                      this.provinceID = res[i].id
                      this.options[0].children[this.areaindex].children = []
                      if (this.IsInArray(this.placeDataType, 'all')) {
                        this.options[0].children[this.areaindex].children.unshift({
                          id: '',
                          regionCode: '',
                          regionName: '全部',
                        })
                      }
                      this.getProvinceByDistrictId({
                        id: this.provinceID,
                      }).then((res) => {
                        res.forEach((item, i) => {
                          if (this.placeDataType.length > 3) {
                            this.options[0].children[this.areaindex].children.push({
                              regionName: item.regionName,
                              children: [],
                              id: item.id,
                              regionCode: item.regionCode,
                            })
                          } else {
                            this.options[0].children[this.areaindex].children.push({
                              regionName: item.regionName,
                              id: item.id,
                              regionCode: item.regionCode,
                            })
                          }
                        })
                        this.options[0].children[this.areaindex].children = this.clearRepetition(
                          this.options[0].children[this.areaindex].children,
                        )
                        if (this.IsInArray(this.placeDataType, 'city')) {
                          for (let j = 0; j < res.length; j++) {
                            if (data[2] === res[j].regionCode) {
                              //  存储当前索引
                              if (this.IsInArray(this.placeDataType, 'all')) {
                                this.provinceindex = j + 1
                                this.index3 = j + 1
                              } else {
                                this.provinceindex = j
                                this.index3 = j
                              }
                              // 获取城市
                              this.cityID = res[j].id
                              this.options[0].children[this.areaindex].children[this.provinceindex].children = []
                              if (this.IsInArray(this.placeDataType, 'all')) {
                                this.options[0].children[this.areaindex].children[this.provinceindex].children.unshift({
                                  id: '',
                                  regionCode: '',
                                  regionName: '全部',
                                })
                              }
                              this.getByParentId({
                                parentId: this.cityID,
                              }).then((res) => {
                                res.forEach((item, i) => {
                                  if (this.placeDataType.length > 4) {
                                    this.options[0].children[this.areaindex].children[this.provinceindex].children.push(
                                      {
                                        regionName: item.regionName,
                                        children: [],
                                        id: item.id,
                                        regionCode: item.regionCode,
                                      },
                                    )
                                  } else {
                                    this.options[0].children[this.areaindex].children[this.provinceindex].children.push(
                                      {
                                        regionName: item.regionName,
                                        id: item.id,
                                        regionCode: item.regionCode,
                                      },
                                    )
                                  }
                                })
                                this.options[0].children[this.areaindex].children[
                                  this.provinceindex
                                ].children = this.clearRepetition(
                                  this.options[0].children[this.areaindex].children[this.provinceindex].children,
                                )
                                if (this.IsInArray(this.placeDataType, 'region')) {
                                  for (let g = 0; g < res.length; g++) {
                                    if (data[3] === res[g].regionCode) {
                                      //  存储索引
                                      if (this.IsInArray(this.placeDataType, 'all')) {
                                        this.cityindex = g + 1
                                      } else {
                                        this.cityindex = g
                                      }
                                      // 获取县区
                                      this.regionceID = res[g].id
                                      if (this.IsInArray(this.placeDataType, 'all')) {
                                        this.options[0].children[this.areaindex].children[this.provinceindex].children[
                                          this.cityindex
                                        ].children.unshift({
                                          id: '',
                                          regionCode: '',
                                          regionName: '全部',
                                        })
                                      }
                                      this.getByParentId({
                                        parentId: this.regionceID,
                                      }).then((res) => {
                                        res.forEach((item, i) => {
                                          this.options[0].children[this.areaindex].children[
                                            this.provinceindex
                                          ].children[this.cityindex].children.push({
                                            regionName: item.regionName,
                                            id: item.id,
                                            regionCode: item.regionCode,
                                          })
                                        })
                                        this.options[0].children[this.areaindex].children[this.provinceindex].children[
                                          this.cityindex
                                        ].children = this.clearRepetition(
                                          this.options[0].children[this.areaindex].children[this.provinceindex]
                                            .children[this.cityindex].children,
                                        )
                                      })
                                    }
                                  }
                                }
                              })
                            }
                          }
                        }
                      })
                    }
                  }
                }
              })
            }
          })
          break
        case 'area':
          this.getArea().then(() => {
            this.options = this.clearRepetition(this.options)
            if (this.IsInArray(this.placeDataType, 'province')) {
              for (let i = 0; i < this.options.length; i++) {
                if (data[0] === this.options[i].regionCode) {
                  //  存储索引
                  this.provinceindex = i
                  //  获取对应地区ID
                  this.areaID = this.options[i].id
                  this.options[this.provinceindex].children = []
                  this.getProvinceByDistrictId({
                    id: this.areaID,
                  }).then((res) => {
                    res.forEach((item, i) => {
                      if (this.placeDataType.length > 2) {
                        this.options[this.provinceindex].children.push({
                          regionName: item.regionName,
                          children: [],
                          id: item.id,
                          regionCode: item.regionCode,
                        })
                      } else {
                        this.options[this.provinceindex].children.push({
                          regionName: item.regionName,
                          id: item.id,
                          regionCode: item.regionCode,
                        })
                      }
                    })
                    this.options[this.provinceindex].children = this.clearRepetition(
                      this.options[this.provinceindex].children,
                    )
                    if (this.IsInArray(this.placeDataType, 'city')) {
                      for (let j = 0; j < res.length; j++) {
                        if (data[1] === res[j].regionCode) {
                          // 存储索引
                          this.cityindex = j
                          this.provinceID = res[j].id
                          this.options[this.provinceindex].children[this.cityindex].children = []
                          this.getByParentId({
                            parentId: this.provinceID,
                          }).then((res) => {
                            res.forEach((item, i) => {
                              if (this.placeDataType.length > 3) {
                                this.options[this.provinceindex].children[this.cityindex].children.push({
                                  regionName: item.regionName,
                                  children: [],
                                  id: item.id,
                                  regionCode: item.regionCode,
                                })
                              } else {
                                this.options[this.provinceindex].children[this.cityindex].children.push({
                                  regionName: item.regionName,
                                  id: item.id,
                                  regionCode: item.regionCode,
                                })
                              }
                            })
                            this.options[this.provinceindex].children[this.cityindex].children = this.clearRepetition(
                              this.options[this.provinceindex].children[this.cityindex].children,
                            )
                            if (this.IsInArray(this.placeDataType, 'region')) {
                              for (let g = 0; g < res.length; g++) {
                                if (data[2] === res[g].regionCode) {
                                  // 存储索引
                                  this.areaindex = g
                                  this.cityID = res[g].id
                                  this.getByParentId({
                                    parentId: this.cityID,
                                  }).then((res) => {
                                    res.forEach((item, i) => {
                                      this.options[this.provinceindex].children[this.cityindex].children[
                                        this.areaindex
                                      ].children.push({
                                        regionName: item.regionName,
                                        id: item.id,
                                        regionCode: item.regionCode,
                                      })
                                    })
                                    this.options[this.provinceindex].children[this.cityindex].children[
                                      this.areaindex
                                    ].children = this.clearRepetition(
                                      this.options[this.provinceindex].children[this.cityindex].children[this.areaindex]
                                        .children,
                                    )
                                  })
                                }
                              }
                            }
                          })
                        }
                      }
                    }
                  })
                }
              }
            }
          })
          break
        case 'province':
          this.getProvince().then(() => {
            this.options = this.clearRepetition(this.options)
            if (this.IsInArray(this.placeDataType, 'city')) {
              for (let i = 0; i < this.options.length; i++) {
                if (data[0] === this.options[i].regionCode) {
                  //  存储索引
                  this.provinceindex = i
                  //  获取对应地区ID
                  this.provinceID = this.options[i].id
                  this.options[this.provinceindex].children = []
                  this.getByParentId({
                    parentId: this.provinceID,
                  }).then((res) => {
                    res.forEach((item, i) => {
                      if (this.placeDataType.length > 2) {
                        this.options[this.provinceindex].children.push({
                          regionName: item.regionName,
                          children: [],
                          id: item.id,
                          regionCode: item.regionCode,
                        })
                      } else {
                        this.options[this.provinceindex].children.push({
                          regionName: item.regionName,
                          id: item.id,
                          regionCode: item.regionCode,
                        })
                      }
                    })
                    this.options[this.provinceindex].children = this.clearRepetition(
                      this.options[this.provinceindex].children,
                    )
                    if (this.IsInArray(this.placeDataType, 'region')) {
                      for (let j = 0; j < res.length; j++) {
                        if (data[1] === res[j].regionCode) {
                          // 存储索引
                          this.cityindex = j
                          this.cityID = res[j].id
                          this.options[this.provinceindex].children[this.cityindex].children = []
                          this.getByParentId({
                            parentId: this.cityID,
                          }).then((res) => {
                            res.forEach((item, i) => {
                              this.options[this.provinceindex].children[this.cityindex].children.push({
                                regionName: item.regionName,
                                id: item.id,
                                regionCode: item.regionCode,
                              })
                            })
                            this.options[this.provinceindex].children[this.cityindex].children = this.clearRepetition(
                              this.options[this.provinceindex].children[this.cityindex].children,
                            )
                          })
                        }
                      }
                    }
                  })
                }
              }
            }
          })
          break
      }
      // console.log('选中的项', this.selectedOptions)
    },
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    handleChange(val) {
      //  返回参数给父组件
      this.curareamessage = []
      this.vals = this.getCascaderObj(this.selectedOptions, this.options)
      this.vals.map((item, index) => {
        this.curareamessage.push(
          Object.assign(
            {},
            {
              id: item.id,
              regionCode: item.regionCode,
              regionName: item.regionName,
            },
          ),
        )
      })
      for (let i = 0; i < this.curareamessage.length; i++) {
        if (this.curareamessage[i].regionName === '全部') {
          this.curareamessage.splice(i, 1)
        }
      }
      if (val.length === 0) {
        this.curareamessage = []
        this.$emit('getareamessage', this.curareamessage)
      } else {
        this.$emit('getareamessage', this.curareamessage)
      }
    },
    handleItemChange(val) {
      const value = []
      // console.log('change', val)
      for (let i = 0; i < val.length; i++) {
        if (val[i]) {
          value.push(val[i])
        }
      }
      this.index1 = this.options.findIndex((item) => {
        return item.id === value[0]
      })
      if (value.length === 1) {
        this.options[this.index1].children = []
        //  是否显示全部
        if (this.IsInArray(this.placeDataType, 'all')) {
          this.options[this.index1].children.unshift({
            id: '',
            regionCode: '',
            regionName: '全部',
          })
        }
        switch (this.placeDataType[0]) {
          case 'country':
            this.getlisyDistrict({
              id: value[0],
            }).then((res) => {
              res.forEach((item, i) => {
                if (this.placeDataType.length > 2) {
                  this.options[this.index1].children.push({
                    regionName: item.name,
                    children: [],
                    id: item.id,
                    regionCode: item.code,
                  })
                } else {
                  this.options[this.index1].children.push({
                    regionName: item.name,
                    id: item.id,
                    regionCode: item.code,
                  })
                }
              })
            })
            break
          case 'area':
            this.getProvinceByDistrictId({
              id: value[0],
            }).then((res) => {
              //  缓存数据
              //  this.Cachedata[value[0]] = res
              //  sessionStorage.setItem('getareadata', JSON.stringify(this.Cachedata))
              res.forEach((item, i) => {
                if (this.placeDataType.length > 2) {
                  this.options[this.index1].children.push({
                    regionName: item.regionName,
                    children: [],
                    id: item.id,
                    regionCode: item.regionCode,
                  })
                } else {
                  this.options[this.index1].children.push({
                    regionName: item.regionName,
                    id: item.id,
                    regionCode: item.regionCode,
                  })
                }
              })
            })
            break
          case 'province':
            this.getByParentId({
              parentId: value[0],
            }).then((res) => {
              //  缓存数据
              //  this.Cachedata[value[0]] = res
              //  sessionStorage.setItem('getareadata', JSON.stringify(this.Cachedata))
              res.forEach((item, i) => {
                if (this.placeDataType.length > 2) {
                  this.options[this.index1].children.push({
                    regionName: item.regionName,
                    children: [],
                    id: item.id,
                    regionCode: item.regionCode,
                  })
                } else {
                  this.options[this.index1].children.push({
                    regionName: item.regionName,
                    id: item.id,
                    regionCode: item.regionCode,
                  })
                }
              })
            })
            break
        }
      } else if (value.length === 2) {
        this.index2 = this.options[this.index1].children.findIndex((item) => {
          return item.id === value[1]
        })
        this.options[this.index1].children[this.index2].children = []
        if (this.IsInArray(this.placeDataType, 'all')) {
          this.options[this.index1].children[this.index2].children.unshift({
            id: '',
            regionCode: '',
            regionName: '全部',
          })
          //  this.index2 = this.index2 + 1
        }
        if (this.placeDataType[1] === 'area') {
          this.getProvinceByDistrictId({
            id: value[1],
          }).then((res) => {
            //  缓存数据
            //  this.Cachedata[value[1]] = res
            //  sessionStorage.setItem('getareadata', JSON.stringify(this.Cachedata))
            res.forEach((item, i) => {
              if (this.placeDataType.length > 3) {
                this.options[this.index1].children[this.index2].children.push({
                  regionName: item.regionName,
                  children: [],
                  id: item.id,
                  regionCode: item.regionCode,
                })
              } else {
                this.options[this.index1].children[this.index2].children.push({
                  regionName: item.regionName,
                  id: item.id,
                  regionCode: item.regionCode,
                })
              }
            })
          })
        } else {
          this.getByParentId({
            parentId: value[1],
          }).then((res) => {
            //  缓存数据
            res.forEach((item, i) => {
              if (this.placeDataType.length > 3) {
                this.options[this.index1].children[this.index2].children.push({
                  regionName: item.regionName,
                  children: [],
                  id: item.id,
                  regionCode: item.regionCode,
                })
              } else {
                this.options[this.index1].children[this.index2].children.push({
                  regionName: item.regionName,
                  id: item.id,
                  regionCode: item.regionCode,
                })
              }
            })
          })
        }
      } else if (value.length === 3) {
        this.index3 = this.options[this.index1].children[this.index2].children.findIndex((item) => {
          return item.id === value[2]
        })
        this.options[this.index1].children[this.index2].children[this.index3].children = []
        if (this.IsInArray(this.placeDataType, 'all')) {
          this.options[this.index1].children[this.index2].children[this.index3].children.unshift({
            id: '',
            regionCode: '',
            regionName: '全部',
          })
        }
        this.getByParentId({
          parentId: value[2],
        }).then((res) => {
          //  缓存数据
          //  this.Cachedata[value[2]] = res
          //  sessionStorage.setItem('getareadata', JSON.stringify(this.Cachedata))
          res.forEach((item, i) => {
            if (this.placeDataType.length > 4) {
              this.options[this.index1].children[this.index2].children[this.index3].children.push({
                regionName: item.regionName,
                children: [],
                id: item.id,
                regionCode: item.regionCode,
              })
            } else {
              this.options[this.index1].children[this.index2].children[this.index3].children.push({
                regionName: item.regionName,
                id: item.id,
                regionCode: item.regionCode,
              })
            }
          })
        })
      } else if (value.length === 4) {
        this.index4 = this.options[this.index1].children[this.index2].children[this.index3].children.findIndex(
          (item) => {
            return item.id === value[3]
          },
        )
        const lastChildren = this.options[this.index1].children[this.index2].children[this.index3].children[this.index4]
          .children
        if (this.IsInArray(this.placeDataType, 'all')) {
          // 如果大于1(就算没区县数据 最少也有【全部】选项数据) 区县数组 已经赋值过了 不再重复请求 ---fix修复了多次赋值 添加重复数据bug
          if (lastChildren.length < 1) {
            lastChildren.unshift({
              id: '',
              regionCode: '',
              regionName: '全部',
            })
          }
        }
        this.getByParentId({
          parentId: value[3],
        }).then((res) => {
          res.forEach((item, i) => {
            lastChildren.push({
              regionName: item.regionName,
              id: item.id,
              regionCode: item.regionCode,
            })
          })
        })
      }
    },
    IsInArray(arr, val) {
      var testStr = ',' + arr.join(',') + ','
      return testStr.indexOf(',' + val + ',') !== -1
    },
    //  初始获取国家
    async getCountry() {
      if (JSON.parse(sessionStorage.getItem('country'))) {
        JSON.parse(sessionStorage.getItem('country')).forEach((item, index) => {
          if (this.placeDataType.length > 1) {
            this.options.push({
              regionName: item.chineseName,
              children: [],
              id: item.id,
              regionCode: item.code,
            })
          } else {
            this.options.push({
              regionName: item.chineseName,
              id: item.id,
              regionCode: item.code,
            })
          }
        })
      } else {
        await this.getListCountry().then((res) => {
          // 缓存国家
          sessionStorage.setItem('country', JSON.stringify(res))
          res.forEach((item, index) => {
            if (this.placeDataType.length > 1) {
              this.options.push({
                regionName: item.chineseName,
                children: [],
                id: item.id,
                regionCode: item.code,
              })
            } else {
              this.options.push({
                regionName: item.chineseName,
                id: item.id,
                regionCode: item.code,
              })
            }
          })
        })
      }
    },
    // 初始获取地区
    async getArea() {
      const areaCache = JSON.parse(sessionStorage.getItem('area'))
      if (areaCache) {
        areaCache.forEach((item, index) => {
          if (this.placeDataType.length > 1) {
            this.options.push({
              regionName: item.name,
              children: [],
              id: item.id,
              regionCode: item.code,
            })
          } else {
            this.options.push({
              regionName: item.name,
              id: item.id,
              regionCode: item.code,
            })
          }
        })
      } else {
        await this.getlisyDistrict({
          id: 1,
        }).then((res) => {
          //  缓存地区
          sessionStorage.setItem('area', JSON.stringify(res))
          res.forEach((item, index) => {
            if (this.placeDataType.length > 1) {
              this.options.push({
                regionName: item.name,
                children: [],
                id: item.id,
                regionCode: item.code,
              })
            } else {
              this.options.push({
                regionName: item.name,
                id: item.id,
                regionCode: item.code,
              })
            }
          })
        })
      }
    },
    //  初始获取省份
    async getProvince() {
      try {
        // this.options = []
        if (JSON.parse(sessionStorage.getItem('province'))) {
          // console.log('有缓存')
          JSON.parse(sessionStorage.getItem('province')).forEach((item, index) => {
            if (this.placeDataType.length > 1) {
              this.options.push({
                regionName: item.regionName,
                children: [],
                id: item.id,
                regionCode: item.regionCode,
              })
            } else {
              this.options.push({
                regionName: item.regionName,
                id: item.id,
                regionCode: item.regionCode,
              })
            }
          })
        } else {
          // console.log('没有缓存')
          await this.listProvinceByCountryId({
            countryId: 1,
          }).then((res) => {
            // 缓存省份
            sessionStorage.setItem('province', JSON.stringify(res))
            res.forEach((item, index) => {
              if (this.placeDataType.length > 1) {
                this.options.push({
                  regionName: item.regionName,
                  children: [],
                  id: item.id,
                  regionCode: item.regionCode,
                })
              } else {
                this.options.push({
                  regionName: item.regionName,
                  id: item.id,
                  regionCode: item.regionCode,
                })
              }
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 去重
    clearRepetition(data) {
      const hash = {}
      return data.reduce((preVal, curVal) => {
        hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
        return preVal
      }, [])
    },
  },
}
</script>

<style lang="scss">
.l-area_input {
  //width: 590px;

  // /deep/ .el-cascader--medium {
  //   width: 100% !important;
  // }

  // /deep/ .el-input__inner {
  //   width: 100% !important;
  // }
}
</style>

<style lang="scss">
.cascader {
  .el-scrollbar__wrap {
    height: 300px;
  }
  .el-cascader-node__label {
    color: #333 !important;
  }
  .el-cascader-node.in-active-path,
  .el-cascader-node.is-active,
  .el-cascader-node.is-selectable.in-checked-path {
    color: #333 !important;
  }
}
</style>
