import { useContext, useEffect, useRef } from "react"
import axiosInstance, {getAxiosInstance} from "../axios/axiosInstances"
import { AuthContext } from "../App"

const useRefreshIntercept = () => {
  const axiosInstanceRef = useRef(null);

  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = getAxiosInstance()
  }

  const interceptedInstance = axiosInstanceRef.current
  const { user, setUser } = useContext(AuthContext)

  useEffect(() => {
    const abortController = new AbortController()
    const requestInterceptor = interceptedInstance.interceptors.request.use(
      config => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = "Bearer " + user.accessToken
        }
        return config
      },
      error => {
        Promise.reject(error)
      }
    )
    let responseInterceptor = null
    if (localStorage.getItem("cookie_agreement") === "accepted") {
      responseInterceptor = interceptedInstance.interceptors.response.use(
        response => response,
        async error => {
          const originalRequest = error.config
          if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest?.sent) {
            originalRequest.sent = true
            try {
              const response = await axiosInstance.get("/server/db_queries/credentials/validate.php", {
                signal: abortController.signal,
                withCredentials: true
              })
              setUser({ id: response.data.id, role: response.data.role, accessToken: response.data.access_token })
              originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`
              return interceptedInstance(originalRequest)
            }
            catch (err) {
              return Promise.reject(err)
            }
          }
          else {
            return Promise.reject(error)
          }
        }
      )
    }

    return () => {
      abortController.abort()
      interceptedInstance.interceptors.request.eject(requestInterceptor)
      interceptedInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [user])

  return interceptedInstance
}

export default useRefreshIntercept 
