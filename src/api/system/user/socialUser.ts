import { defHttp } from '@/utils/http/axios'

// 社交绑定，使用 code 授权码
export const socialBind = (type, code, state) => {
  return defHttp.post({
    url: '/system/social-user/bind',
    data: {
      type,
      code,
      state
    }
  })
}

// 取消社交绑定
export const socialUnbind = (type, openid) => {
  return defHttp.delete({
    url: '/system/social-user/unbind',
    data: {
      type,
      openid
    }
  })
}

// 社交授权的跳转
export const socialAuthRedirect = (type, redirectUri) => {
  return defHttp.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
