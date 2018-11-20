import axios from "axios";
import GUtils from './GUtils'
import {
  Message
} from 'element-ui';
import ErrorCode from "./ErrorCode"
import qs from "qs"
import router from '../router/index'
axios.defaults.baseURL = "http://test.spap.com"

// 设置请求超时
axios.defaults.timeout = "10000"
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'


// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let data = config.data;
  let token = sessionStorage.getItem("conference-token");
  if (token) {
    data.token = token;
  }
  data.uuid = GUtils.getUUID();
  let params = Object.keys(data).sort();
  let encryptStr = '';
  for (let i = 0; i < params.length; i++) {
    if (i === params.length - 1) {
      encryptStr += params[i] + '=' + data[params[i]];
    } else {
      encryptStr += params[i] + '=' + data[params[i]] + '&';
    }
  }
  //SHA256加密
  let appTicket = sessionStorage.getItem("win-ticket");
  appTicket = appTicket ? appTicket : "spap_2018_go";
  let url = config.url.replace(config.baseURL,"");
  if (url == "/s10/auth/login" || url == "/s10/auth/login/qr/key" || url == "/s10/auth/login/qr/status") {
    appTicket = "spap_2018_go";
  }
  let encryptResult = GUtils.getEncryptKey(encryptStr, appTicket);
  data.sign = encryptResult;
  config.data = qs.stringify(data);
  return config;
}, function (error) {
  // Do something with request error
  Message({
    showClose: false,
    message: error + "这是require",
    type: 'error'
  });
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  let res = response.data;
  if (res.code !== 200) {
    let codeText = ErrorCode.getError(res.code);
    response.data.desc = codeText;
    if (res.code == 800) {
      router.push({
        path: "/login"
      })
    }
  }
  return response;
}, function (error) {
  // Do something with response error
  Message({
    showClose: false,
    message: error + "这是response",
    type: 'error'
  });

  return Promise.reject(error);
});
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
let CancelToke = axios.CancelToken;
let source = CancelToke.source();
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
      .catch(res => {
        if (axiso.isCancel(res)) {
          console.log('Rquest canceled', res.message);
        } else {
        }
      })
  })
}
export function absortHttp() {
  source.cancel("message");
}

export default axios
