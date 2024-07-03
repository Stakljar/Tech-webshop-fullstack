import "../styles/Orders.css"
import { Fragment, useContext, useEffect, useState } from "react"
import Order from "../items/Order"
import Loading from "../util_components/Loading"
import useRefreshIntercept from "../hooks/useRefreshIntercept"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import { roles } from "../data/data"

export default function Orders() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState([])
  const interceptedInstance = useRefreshIntercept()

  useEffect(() => {
    if (isLoading) {
      const abortController = new AbortController()
      const fetchOrders = async () => {
        try {
          const response = await interceptedInstance.post("/server/db_queries/transactions_fetch.php", JSON.stringify({ id: user.id, role: user.role }), {
            signal: abortController.signal,
            headers: {
              "Authorization": "Bearer " + user.accessToken
            }
          })
          setIsLoading(false)
          setResult(response.data)
        }
        catch (error) {
          if (error?.code === "ERR_CANCELED") {
            return
          }
          setIsLoading(false)
          if (error.response?.status === 401) {
            setUser({ id: "", role: roles.guest, accessToken: "" })
            navigate("/employee_login", { state: { previousLocation: location }, replace: true })
          }
          else if (error.response?.status === 403) {
            navigate("/")
            window.location.reload()
          }
          else {
            alert(error)
          }
        }
      }
      fetchOrders()
    }
    return () => abortController.abort()
  }, [isLoading])

  return (
    <>
      {isLoading ? <Loading /> :
        <div id="orders">
          {
            result.length === 0 ? <div id="orders__no-result"><h1>No pending orders</h1></div> :
              result.map((v) => <Fragment key={v.id}>
                <Order {...v}
                  updateOrder={(status, id) => setResult(prev => prev.map((value) => {
                    if (value.id === id) {
                      value.transaction_status = status;
                      return value
                    }
                    else {
                      return value
                    }
                  }))}
                  deleteOrder={(id) => setResult(prev => prev.filter((v) => v.id !== id))} />
              </Fragment>)
          }
        </div>
      }
    </>
  )
}