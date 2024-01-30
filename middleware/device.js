/*
 * @Author: hyman
 * @Date: 2021-04-29 18:10:08
 * @LastEditors: hyman
 * @LastEditTime: 2022-05-07 15:44:03
 * @Description: 设备中间件
 */

import { deviceType } from "~/utils/device/device-type";

export default function (context) {
  context.userAgent = process.server
    ? context.req.headers["user-agent"]
    : navigator.userAgent;
  // 给全局上下文添加一个属性来保存我们返回的匹配信息
  context.deviceType = deviceType(context.userAgent);
  // 注入到 store
  // context.store.commit("updateDeviceTypeMutation", context.deviceType);
}
