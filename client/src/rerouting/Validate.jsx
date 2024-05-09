import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../App"
import { Outlet } from "react-router-dom"
import { roles } from "../utils/utils"
import Loading from "../util_components/Loading"
import axiosInstance from "../axios/axiosInstance"

export default function Validate() {
  const { setUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()
    if (isLoading) {
      const refresh = async () => {
        try {
          const response = await axiosInstance.get("/server/db_queries/credentials/validate.php", {
            signal: abortController.signal,
            withCredentials: true
          })
          setIsLoading(false)
          setUser({ id: response.data.id, role: response.data.role, accessToken: response.data.access_token })
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsLoading(false)
          alert(error)
        }
      }
      if (localStorage.getItem("cookie_agreement") === "accepted") {
        refresh()
      }
      else {
        setUser({ id: "", role: roles.guest, accessToken: "" })
        setIsLoading(false)
      }
    }
    return () => abortController.abort()
  }, [])

  return (
    <>
      {isLoading ? <Loading /> : <Outlet />}
    </>
  )
}
