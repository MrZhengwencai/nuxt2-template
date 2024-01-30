/**
 *
 * @param {*} UA ,就是userAgent
 * @returns  type: 设备类型
 *           env: 访问环境(微信/微博/qq)
 *           masklayer: 就是给外部拿到判断是否显示遮罩层的,一些特殊环境要引导用户到外部去打开访问
 */

function isWechat(UA) {
  return /MicroMessenger/i.test(UA) ? true : false;
}

function isWeibo(UA) {
  return /Weibo/i.test(UA) ? true : false;
}

function isQQ(UA) {
  return /QQ/i.test(UA) ? true : false;
}

function isMobile(UA) {
  return /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(UA)
    ? true
    : false;
}

function isIPad(UA) {
  return /iPad|iPod/i.test(UA) ? true : false;
}

function isTablet(UA) {
  const isAndroid = /(?:Android)/.test(UA)
  const isFireFox = /(?:Firefox)/.test(UA)
  return /(?:iPad|PlayBook)/.test(UA) || (isAndroid && !/(?:Mobile)/.test(UA)) || (isFireFox && /(?:Tablet)/.test(UA)) ? true : false;
}

function isIOS(UA) {
  return /iPhone/i.test(UA) ? true : false;
}

function isAndroid(UA) {
  return /Android/i.test(UA) ? true : false;
}

export function deviceType(UA) {
  if (isMobile(UA)) {
    if (isIOS(UA)) {
      if (isWechat(UA)) {
        return {
          isMobile: true,
          type: "ios",
          env: "wechat",
          masklayer: true,
        };
      }
      if (isWeibo(UA)) {
        return {
          isMobile: true,
          type: "ios",
          env: "weibo",
          masklayer: true,
        };
      }
      if (isQQ(UA)) {
        return {
          isMobile: true,
          type: "ios",
          env: "qq",
          masklayer: true,
        };
      }
      return {
        isMobile: true,
        type: "ios",
      };
    }

    if (isIPad(UA)) {
      if (isWechat(UA)) {
        return {
          isMobile: true,
          type: "ipad",
          env: "wechat",
          masklayer: true,
        };
      }
      if (isWeibo(UA)) {
        return {
          isMobile: true,
          type: "ipad",
          env: "weibo",
          masklayer: true,
        };
      }
      if (isQQ(UA)) {
        return {
          isMobile: true,
          type: "ipad",
          env: "qq",
          masklayer: true,
        };
      }
      return {
        isMobile: true,
        type: "ipad",
      };
    }

    if (isTablet(UA)) {
      return {
        isTablet: true,
        isMobile: true,
        type: "ipad",
      };
    }

    if (isAndroid(UA)) {
      if (isWechat(UA)) {
        return {
          isMobile: true,
          type: "android",
          env: "wechat",
          masklayer: true,
        };
      }
      if (isWeibo(UA)) {
        return {
          isMobile: true,
          type: "android",
          env: "weibo",
          masklayer: true,
        };
      }
      if (isQQ(UA)) {
        return {
          isMobile: true,
          type: "android",
          env: "qq",
          masklayer: true,
        };
      }
      return {
        isMobile: true,
        type: "android",
      };
    }

    return {
      isMobile: true,
      type: "mobile",
    };
  } else {
    return {
      isMobile: false,
      type: "pc",
    };
  }
}
