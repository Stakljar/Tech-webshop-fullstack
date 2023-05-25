import "../styles/PurchaseHistory.css"
import { Fragment, useContext, useEffect, useState } from "react"
import PurchaseHistoryItem from "../items/PurchaseHistoryItem"
import useRefreshIntercept from "../hooks/useRefreshIntercept"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import Loading from "../util_components/Loading"
import { roles } from "../utils/Utils"

export default function PurchaseHistory() {
  const { user, setUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const interceptedInstance = useRefreshIntercept()
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    if (isLoading) {
      const fetchOrders = async () => {
        try {
          const response = await interceptedInstance.post("/server/db_queries/transactions_fetch.php", JSON.stringify({ id: user.id, role: user.role }), {
            signal: abortController.signal
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
            navigate("/login", { state: { previousLocation: location }, replace: true })
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
      {
        isLoading ? <Loading /> :
        <div id="purchase-history">
          {
            result.length === 0 ? <div id="purchase-history__no-result"><h1>No results</h1></div> : result.map((v) =>
              <Fragment key={v.id}>
                <PurchaseHistoryItem price={v.price * v.amount} name={v.product_name} quantity={v.amount} date={v.order_date} />
              </Fragment>)
          }
        </div>
      }
    </>
  )
}
