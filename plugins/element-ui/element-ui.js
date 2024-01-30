import Vue from 'vue'
import '@/assets/css/element-varibles.scss'
import {
  Message, MessageBox, Pagination, Input, InputNumber, Checkbox, CheckboxGroup, Form, Row, Col,
  FormItem, Button, Cascader, Dialog, Loading, Table, TableColumn, Image, Steps, Step, DatePicker,
  Tooltip, Progress, Select, Option, Upload, Card, Breadcrumb, BreadcrumbItem, Rate, Popover, Skeleton, SkeletonItem, Carousel, CarouselItem
} from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

const components = [
  Message, MessageBox, Pagination, Input, InputNumber, Checkbox, CheckboxGroup, Form, Row, Col,
  FormItem, Button, Cascader, Dialog, Table, TableColumn, Image, Steps, Step, DatePicker, Tooltip,
  Progress, Select, Option, Upload, Card, Breadcrumb, BreadcrumbItem, Rate, Popover, Skeleton, SkeletonItem, Carousel, CarouselItem
];

const Element = {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

Vue.use(Element, { locale });
Vue.use(Loading.directive);

// 看需要:全局写入prototype
// 消息弹窗
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$loading = Loading.service;
