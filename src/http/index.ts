import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosPromise,
  AxiosInterceptorManager,
  AxiosResponse,
} from "axios";
interface httpRes {
  code: number;
  success: boolean;
  data: any;
  msg: string;
  repCode: string;
}
interface NewAxiosInstance extends AxiosInstance {
  /* 
  设置泛型T，默认为any，将请求后的结果返回变成AxiosPromise<T>
  */
  (config: AxiosRequestConfig): AxiosPromise<httpRes>;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse<httpRes>>;
  };
}
const instance: NewAxiosInstance = axios.create({
  baseURL: "http://192.168.1.23:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    tenant: "8147ff51bede4f089f194f2627561a84",
  },
});
/**
 * axios请求拦截器配置
 * @param config
 * @returns {any}
 */
const requestConf = (config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `${token}`;
  }
  return config;
};
/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(requestConf, (error) => {
  return Promise.reject(error);
});

/**
 * axios响应拦截器
 * @param data response数据
 * @returns {Promise<*|*>}
 */
const handleData = (data: AxiosResponse<httpRes, any>) => {
  // 若data.code存在，覆盖默认code
  switch (data.status) {
    case 200:
      // 业务层级错误处理，以下是假定restful有一套统一输出格式(指不管成功与否都有相应的数据格式)情况下进行处理
      // 例如响应内容：
      // 错误内容：{ code: 1, msg: '非法参数' }
      // 正确内容：{ code: 200, data: {  }, msg: '操作正常' }
      // return data
      return data;
  }
  return Promise.reject(data);
};
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error;
    if (response === undefined) {
      return Promise.reject({});
    } else return handleData(response);
  }
);
const http = (obj: AxiosRequestConfig & { url: string }) => {
  /* 
  限制最终的返回数据类型
  */
  return new Promise<httpRes>((resolve, reject) => {
    /* 
    传递泛型给http中的拦截器
    */
    instance(obj)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export default http;
