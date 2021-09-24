import axios from "axios";
import Qs from "qs";
import router from "./router";


/** @type {Array} */
let requestsToRefresh = []

const STORAGE_TOKEN_KEY = 'access_token'
const STORAGE_REFRESH_TOKEN_KEY = 'refresh_token'
//let currentToken = localStorage.getItem("access_token");
//let currentRefrehToken = localStorage.getItem("refresh_token");


/** @type {boolean} */
let isRefreshRequesting = false


const setToken = (token) => {
  const cutToken = `${token.substring(0, 5)}..${token.substring(token.length - 5)}`

  console.log(`Set token: ${cutToken}`)
  localStorage.setItem(STORAGE_TOKEN_KEY, token)
  axios.defaults.headers['Authorization'] = 'Bearer ' + token
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
}

const setRefreshToken = (token) => {
  const cutRefreshToken = `${token.substring(0, 5)}..${token.substring(token.length - 5)}`

  console.log(`Set cutRefreshToken: ${cutRefreshToken}`)
  localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, token)
}

const clearToken = () => {
  console.log('Clear token')
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY)
  axios.defaults.headers['Authorization'] = null
}


axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  (config) => {
    const currentToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (currentToken && !config.noAuth) {
      config.headers["Authorization"] = "Bearer " + currentToken;     
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//Add a response interceptor

axios.interceptors.response.use(null, (err) => {
  
  const { response, config } = err
  const currentToken = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (response.status === 401) {
    // If we have not logged in before, it makes no sense
    // to try to get a new token
    if (!currentToken) {
      router.push({ name: "login" }). catch (() => {
        return Promise.reject(err)
      });
      return Promise.reject(err)
    }

    // User is auth, probably token is expired, try renew
    // And send all failed requests again
    if (!isRefreshRequesting) {
      isRefreshRequesting = true

      console.log('Request for a new token')
      const currentRefrehToken = localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY);
      // Send request to refresh token
      axios.post('Account/refresh-token',Qs.stringify({
        refreshtoken: currentRefrehToken,
      }))
        .then(({ data }) => {
          console.log('New token received')
          setToken(data.token)
          setRefreshToken(data.refreshToken)
          requestsToRefresh.forEach((cb) => cb(data.token))
        })
        .catch(() => {
          // If you have a closed system, you can also
          // redirect/router to the login page
          console.log('An error occurred while getting a new token')
          clearToken()
          requestsToRefresh.forEach((cb) => cb(null))
          router.push({ name: "login" });
        })
        .finally(() => {
          console.log('Clear queue of failed requests')
          requestsToRefresh = []
          isRefreshRequesting = false
        })
    }

    console.log(`The request is waiting for a new token.. [${response.config.url}]`)
    return new Promise((resolve, reject) => {
      console.log("requestsToRefresh =",requestsToRefresh)
      console.log("reject =",reject)
      // In our variable (requests that expect a new token
      // from the first request), we add a callback,
      // which the first request to execute
      
      requestsToRefresh.push((token) => {
        if (token) {
          config.headers.Authorization = 'Bearer ' + token
          resolve(axios(config))
        }

        // If the first request could not update the token, we
        // must return the basic request processing logic
        reject(err)
      },(error)=>{
        reject(error)
      })
    })
  }

  return Promise.reject(err)
})
axios.defaults.baseURL = "https://osvaldo2109241000.bateaquihost.com.br/Api/" //"https://localhost:44393/Api/"; 
 axios.headers = {
  Accept: 'application/json, application/xml, text/plain, text/html, *.*',
  "Content-Type": "application/json,  Content-Type: multipart/form-data",
}; 
export default axios;

/* export default axios.create({
    baseURL: 
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
   */
