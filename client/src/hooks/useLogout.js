import { useContext, useEffect } from "react"
import { AuthContext } from "../App"
import axiosInstance from "../axios/axiosInstance"
import { useNavigate } from "react-router-dom"
import { roles } from "../utils/utils"

const useLogout = () => {
  const channel = new BroadcastChannel("logout-channel")
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController()
    const logout = async () => {
      try {
        if (localStorage.getItem("cookie_agreement") === "accepted") {
          await axiosInstance.post("/server/db_queries/credentials/delete_refresh_token.php", {
            signal: abortController.signal,
            withCredentials: true 
          })
        }
        setUser({ id: "", role: roles.guest, accessToken: "" })
        navigate("/")
        return "success"
      }
      catch (error) {
        if(error?.code === "ERR_CANCELED") {
        }
        alert(error)
      }
    }
    channel.onmessage = () => {
      if(logout() === "success"){
        channel.close()
      }
    }

    return () => abortController.abort()
  }, [])

  const performLogout = () => channel.postMessage("logout")
  return performLogout
}

export default useLogout