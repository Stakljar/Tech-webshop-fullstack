import { useContext, useEffect, useState } from "react"
import "../styles/Order.css"
import useRefreshIntercept from "../hooks/useRefreshIntercept"
import { AuthContext } from "../App"
import { useLocation, useNavigate } from "react-router-dom"
import { roles } from "../data/data"

export default function Order(props) {
  const { user, setUser } = useContext(AuthContext)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const interceptedInstance = useRefreshIntercept()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const abortController = new AbortController()
    if (isUpdating) {
      const updateTransaction = async () => {
        try {
          await interceptedInstance.post("/server/db_queries/update_transaction.php",
            JSON.stringify({
              id: user.id, role: user.role, transactionId: props.id,
              updatedStatus: props.transaction_status === "pending" ? "confirmed" : "delivered",
              email: props.recipient_email, productName: props.product_name
            }),
            {
              signal: abortController.signal,
              headers: {
                "Authorization": "Bearer " + user.accessToken
              }
          })
          props.updateOrder(props.transaction_status === "pending" ? "confirmed" : "delivered", props.id)
          setIsUpdating(false)
        }
        catch (error) {
          if (error?.code === "ERR_CANCELED") {
            return
          }
          setIsUpdating(false)
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
      updateTransaction()
    }
    return () => abortController.abort()
  }, [isUpdating])

  useEffect(() => {
    const abortController = new AbortController()
    if (isDeleting) {
      const deleteTransaction = async () => {
        try {
          await interceptedInstance.post("/server/db_queries/delete_transaction.php",
            JSON.stringify({
              id: user.id, role: user.role, transactionId: props.id, status: props.transaction_status,
              email: props.recipient_email, productName: props.product_name
            }),
            {
              signal: abortController.signal,
              headers: {
                "Authorization": "Bearer " + user.accessToken
              }
          })
          props.deleteOrder(props.id)
          setIsDeleting(false)
        }
        catch (error) {
          if (error?.code === "ERR_CANCELED") {
            return
          }
          setIsDeleting(false)
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
      deleteTransaction()
    }
    return () => abortController.abort()
  }, [isDeleting])

  return (
    <>
      {
        props.transaction_status !== "delivered" &&
        <div className={props.transaction_status === "pending" ? "order-pending" : "order-confirmed"}>
          <h2>{props.product_name || "*Deleted product*"}</h2>
          <div>
            <span>Quantity: </span><strong>{props.amount}</strong>
          </div>
          <div>
            <span>Total price: </span><strong>{props.amount * props.price}$</strong>
          </div>
          <h3>Status: </h3>
          <div className="order__status">
            <strong className={props.transaction_status === "pending" ? "order__status__text-pending" : "order__status__text-confirmed"}>
              {props.transaction_status.toUpperCase()}
            </strong>
          </div>
          <h3>Recipient information: </h3>
          <div>
            <span>First name: </span><strong>{props.recipient_name}</strong><br />
            <span>Last name: </span><strong>{props.recipient_surname}</strong><br />
            <span>Email: </span><strong>{props.recipient_email}</strong><br />
            <span>Phone: </span><strong>{props.recipient_phone}</strong><br />
            <span>Address: </span><strong>{`${props.recipient_address} ${props.recipient_city} ${props.recipient_zip}, ${props.recipient_country}`}</strong>
          </div>
          <div>
            <span>Order date: </span><strong>{props.order_date}</strong>
          </div>
          <div className="order__buttons">
            <button className="order__confirm-button" onClick={() => setIsUpdating(true)}>{props.transaction_status === "pending" ? "Confirm" : "Finish"}</button>
            <button className="order__decline-button" onClick={() => setIsDeleting(true)}>{props.transaction_status === "pending" ? "Decline" : "Abort"}</button>
          </div>
        </div>
      }
    </>
  )
}