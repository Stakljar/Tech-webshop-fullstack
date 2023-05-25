import "../styles/ModifyShopItem.css"
import { useContext, useEffect, useState } from "react"
import QuantityInput from "../util_components/QuantityInput"
import { roles } from "../utils/Utils"
import { useLocation, useNavigate } from "react-router-dom"
import useRefreshIntercept from "../hooks/useRefreshIntercept"
import { AuthContext } from "../App"

export default function ModifyShopItem(props) {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const interceptedInstance = useRefreshIntercept()
  const [quantity, setQuantity] = useState(props.quantity)
  const [price, setPrice] = useState(props.price)
  const [didChangeHappen, setDidChangeHappen] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)

  useEffect(() => {
      if (props.price != price || props.quantity != quantity)
        setDidChangeHappen(true)
  }, [quantity, price])

  useEffect(() => {
    const abortController = new AbortController()
    if (isDeleteLoading) {
      const deleteProduct = async () => {
        let data = {
          id: user.id,
          role: user.role,
          productId: props.id,
        }
        try {
          await interceptedInstance.post("/server/db_queries/delete_product.php", JSON.stringify(data), {
            signal: abortController.signal,
            headers: {
              "Authorization": "Bearer " + user.accessToken
            }
          })
          setIsDeleteLoading(false)
          props.removeProduct()
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsDeleteLoading(false)
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
      deleteProduct()
    }
    return () => abortController.abort()
  }, [isDeleteLoading])

  useEffect(() => {
    const abortController = new AbortController()
    if (isUpdateLoading) {
      let data = {
        id: user.id,
        role: user.role,
        productId: props.id,
        price: price,
        quantity: quantity
      }
      const updateProduct = async () => {
        try {
          await interceptedInstance.post("/server/db_queries/update_product.php", JSON.stringify(data), {
            signal: abortController.signal,
            headers: {
              "Authorization": "Bearer " + user.accessToken
            }
          })
          setDidChangeHappen(false)
          setIsUpdateLoading(false)
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsUpdateLoading(false)
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
      updateProduct()
    }
    return () => abortController.abort()
  }, [isUpdateLoading])

  return (
    <div className="modify-shop-item">
      <img className="modify-shop-item__image" src={props.imageUrl} />
      <div className="modify-shop-item__additional">
        <h3>{props.name}</h3>
        <hr/>
        <h4>Type: {props.type}</h4>
        <h4>Brand: {props.brand}</h4>
        <h4>Specifications: {props.specs.map((v, i) => <div key={i} className="modify-shop-item__additional__specs"><strong>{v.key + ": "}</strong><span>
          {v.value === true ? "Yes" : v.value === false ? "No" : v.value}</span></div>)}</h4>
        <div className="modify-shop-item__additional__options">
          <div className="modify-shop-item__additional__options__quantity">
            <div>
              <span>Quantity: </span>
            </div>
            <div className="modify-shop-item__additional__options__quantity__input">
              <QuantityInput quantity={quantity} name="quantity" setQuantity={(e) => setQuantity(e.target.value < 0 ? 0 : e.target.value)}  
                increaseQuantity={() => setQuantity(prev => prev + 1)} decreaseQuantity={() => setQuantity(prev => prev > 0 ? prev - 1 : prev)}/>
            </div>
          </div>
          <div className="modify-shop-item__additional__options__price">
            <div>
              <span>Price: </span>
            </div>
            <div className="modify-shop-item__additional__options__price__input">
              <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value > 99999 ? 99999 : e.target.value < 0 ? 0 : e.target.value)} />
              <span> $</span>
            </div>
          </div>
          <div className="modify-shop-item__additional__options__buttons">
            <button onClick={() => setIsDeleteLoading(true)}>Remove</button>
            {didChangeHappen && <button onClick={() => setIsUpdateLoading(true)}>Modify</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
