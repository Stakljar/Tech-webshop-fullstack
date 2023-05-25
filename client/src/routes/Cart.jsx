import "../styles/Cart.css"
import { Fragment, useContext, useEffect, useState } from "react"
import CartItem from "../items/CartItem"
import Loading from "../util_components/Loading"
import axiosInstance from "../axios/axiosInstance"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext, CartCountContext } from "../App"
import { roles } from "../utils/Utils"
import useRefreshIntercept from "../hooks/useRefreshIntercept"

export default function Cart() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { setCartItemCount } = useContext(CartCountContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuying, setIsBuying] = useState(false)
  const [isSecondPageOpened, setIsSecondPageOpened] = useState(false)
  const [products, setProducts] = useState([])
  const interceptedInstance = useRefreshIntercept()
  const [recipientData, setRecipientData] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "", country: "" })

  useEffect(() => {
    const abortController = new AbortController()
    if (isLoading) {
      const retrieveProducts = async () => {
        try {
          let data = null
          try {
            data = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
            if(!Array.isArray(data)) {
              throw new Error()
            }
          }
          catch(error) {
            data = []
            localStorage.setItem("cart", JSON.stringify(data))
          }
          const response = await axiosInstance.post("/server/db_queries/products_fetch.php", 
            JSON.stringify({ ids: data.map((v) => v.id), searchType: "ids" }),
            { signal: abortController.signal }
          )
          setIsLoading(false)
          setProducts(response.data.map((v) => { return { ...v, amount: data.find(value => value.id === v.id).quantity } }))
          localStorage.setItem("cart", JSON.stringify(data.filter((v) => response.data.find(value => value.id === v.id))))
          setCartItemCount(JSON.parse(localStorage.getItem("cart")).length)
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsLoading(false)
          alert(error)
        }
      }
      retrieveProducts()
    }
    return () => abortController.abort()
  }, [isLoading])

  useEffect(() => {
    const abortController = new AbortController()
    if (isBuying) {
      const placeOrder = async () => {
        if (user.role === roles.guest) {
          try {
            const data = {
              requireCredentials: false,
              recipientData: recipientData,
              products: products.map((v) => { return { id: v.id, quantity: v.amount } }),
              orderDate: new Date().toString(),
            }
            const response = await axiosInstance.post("/server/db_queries/transaction_insert.php", JSON.stringify(data),  {
              signal: abortController.signal
            })
            setIsBuying(false)
            if(response.data?.status === "deleted") {
              alert("Certain item(s) inside cart have been deleted, cart will be refreshed")
              setIsSecondPageOpened(false)
              setIsLoading(true)
              return
            }
            else if(response.data?.status === "exceeded") {
              alert("Requested amount of certain item(s) inside cart is currently not available")
              return
            }
            alert("Purchase successful")
            localStorage.removeItem("cart")
            setCartItemCount(0)
            navigate("/")
          }
          catch (error) {
            if(error?.code === "ERR_CANCELED") {
              return
            }
            setIsBuying(false)
            alert(error)
          }
        }
        else {
          try {
            const data = {
              requireCredentials: true,
              id: user.id,
              role: user.role,
              recipientData: recipientData,
              products: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
              orderDate: new Date().toString(),
            }
            const response = await interceptedInstance.post("/server/db_queries/transaction_insert.php",
              JSON.stringify(data), { headers: { "Authorization": "Bearer " + user.accessToken } }, {
              signal: abortController.signal
            })
            setIsBuying(false)
            if(response.data?.status === "deleted") {
              alert("Certain item(s) inside cart have been deleted, cart will be refreshed")
              setIsSecondPageOpened(false)
              setIsLoading(true)
              return
            }
            else if(response.data?.status === "exceeded") {
              alert("Requested amount of certain item(s) inside cart is currently not available")
              return
            }
            alert("Purchase successful")
            localStorage.removeItem("cart")
            setCartItemCount(0)
            navigate("/")
          }
          catch (error) {
            if(error?.code === "ERR_CANCELED") {
              return
            }
            setIsBuying(false)
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
      }
      placeOrder()
    }
    return () => abortController.abort()
  }, [isBuying])

  function removeProduct(productId) {
    let storageData = null
    try {
      storageData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
      if(!Array.isArray(storageData)) {
        throw new Error()
      }
      localStorage.setItem("cart", JSON.stringify(storageData.filter(v => v.id !== productId)))
      setProducts((prev) => prev.filter((v) => v.id !== productId))
    }
    catch(error) {
      storageData = []
      localStorage.setItem("cart", JSON.stringify(storageData))
      setProducts([])
    }
    setCartItemCount(JSON.parse(localStorage.getItem("cart")).length)
  }

  return (
    <div id="cart">
      {
        !isSecondPageOpened ?
          isLoading ? <Loading /> :
          <div>
            {
              products.length === 0 ? <h1 id="cart__empty">No items</h1> :
              <div>
                <div id="cart-items">
                  {
                    products.map((v) => <Fragment key={v.id}>
                      <CartItem setCartItemCount={setCartItemCount} imageSource={v.image_path} name={v.product_name} price={v.price} quantity={v.amount}
                        removeProduct={() => removeProduct(v.id)} />
                    </Fragment>)
                  }
                </div>
                <div id="cart__buttons">
                  <button onClick={() => navigate("/")}>Cancel</button>
                  <button onClick={() => setIsSecondPageOpened(true)}>Next</button>
                </div>
              </div>
            }
          </div> :  
          <form onSubmit={(e) => { e.preventDefault(); setIsBuying(true) }}>
            <div id="cart__recipient-data">
              <div>
                <label htmlFor="cart__recipient-data__first-name">First name: </label>
                <br />
                <input id="cart__recipient-data__first-name" type="text" name="first-name" value={recipientData.firstName}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, firstName: e.target.value.length > 30 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__last-name">Last name: </label>
                <br />
                <input id="cart__recipient-data__last-name" type="text" name="last-name" value={recipientData.lastName}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, lastName: e.target.value.length > 40 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__email">Email: </label>
                <br />
                <input id="cart__recipient-data__email" type="text" name="email" value={recipientData.email}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, email: e.target.value.length > 100 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__phone">Phone number: </label>
                <br />
                <input id="cart__recipient-data__phone" type="tel" name="phone" value={recipientData.phone}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, phone: e.target.value.length > 20 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__address">Address: </label>
                <br />
                <input id="cart__recipient-data__address" type="text" name="address" value={recipientData.address}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, address: e.target.value.length > 150 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__city">City: </label>
                <br />
                <input id="cart__recipient-data__city" type="text" name="city" value={recipientData.city}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, city: e.target.value.length > 150 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__zip">Zip code: </label>
                <br />
                <input id="cart__recipient-data__zip" type="text" name="zip" value={recipientData.zip}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, zip: e.target.value.length > 13 ? prev : e.target.value } })} required />
              </div>
              <div>
                <label htmlFor="cart__recipient-data__country">Country: </label>
                <br />
                <input id="cart__recipient-data__country" type="text" name="country" value={recipientData.country}
                  onChange={(e) => setRecipientData((prev) => { return { ...prev, country: e.target.value.length > 60 ? prev : e.target.value } })} required />
              </div>
            </div>
            <div class="cart__submit-recipient-data">
              <button type="button" onClick={() => setIsSecondPageOpened(false)}>Back</button>
              <button type="submit">Order</button>
            </div>
          </form>
      }
    </div>
  )
}
