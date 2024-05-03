import "../styles/Authentication.css"
import { useState, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { authType, roles } from "../utils/Utils"
import { AuthContext } from "../App"
import axiosInstance from "../axios/axiosInstance"
import Loading from "../util_components/Loading"

export default function Authentication(props) {
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const previousLocation = location.state?.previousLocation?.pathname || "/";
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [invalidInputMesssage, setInvalidInputMesssage] = useState("")

  useEffect(() => {
    const abortController = new AbortController()
    if (isLoading) {
      setInvalidInputMesssage("")
      const login = async () => {
        try {
          const response = await axiosInstance.post("/server/db_queries/credentials/login.php",
            JSON.stringify({ ...credentials, role: props.role, cookieAgreement: localStorage.getItem("cookie_agreement") }),
            {
              signal: abortController.signal,
              withCredentials: localStorage.getItem("cookie_agreement") === "accepted" ? true : false
          })
          setIsLoading(false)
          if (response.data?.status === "invalid") {
            setInvalidInputMesssage("Invalid username or password")
          }
          else {
            setUser({ id: response.data.id, role: response.data.role, accessToken: response.data.access_token })
            navigate(previousLocation, { replace: true });
          }
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsLoading(false)
          alert(error)
        }
      }

      const register = async () => {
        try {
          const response = await axiosInstance.post("/server/db_queries/credentials/register.php",
            JSON.stringify({...credentials, cookieAgreement: localStorage.getItem("cookie_agreement")}),
            {
              signal: abortController.signal,
              withCredentials: localStorage.getItem("cookie_agreement") === "accepted" ? true : false
            })
          setIsLoading(false)
          if (response.data?.status === "valid") {
            setUser({ id: response.data.id, role: response.data.role, accessToken: response.data.access_token })
            navigate("/", { replace: true })
          }
          else {
            setInvalidInputMesssage("Username already exists")
          }
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          alert(error)
          setIsLoading(false)
        }
      }

      if (props.type === authType.login) {
        login()
      }
      else {
        register()
      }
    }
    return () => abortController.abort()
  }, [isLoading])

  return (
    <div id="authentication">
      <form onSubmit={(e) => { e.preventDefault(); setIsLoading(true) }}>
        <label htmlFor="authentication__username-input">Username: </label>
        <input id="authentication__username-input" type="text" name="username"
          value={credentials.username} onChange={(e) => setCredentials((prev) => { return { ...prev, [e.target.name]: e.target.value } })} required />
        <label htmlFor="authentication__password-input">Password: </label>
        <input id="authentication__password-input" type="password" name="password" value={credentials.password}
          onChange={(e) => setCredentials((prev) => { return { ...prev, [e.target.name]: e.target.value } })} required />
        <button type="submit">{props.type === authType.registration ? "Register" : props.role === roles.employee ? "Employee login" : "Login"}</button>
        {isLoading && <Loading />}
      </form>
      {invalidInputMesssage && <h3 className="authentication__error-text">{invalidInputMesssage}</h3>}
    </div>
  )
}
