import "../styles/ShopItemDetails.css"
import QuantityInput from "../util_components/QuantityInput"
import { AuthContext, CartCountContext } from "../App"
import { roles } from "../utils/utils"
import { useEffect, useState, useContext } from "react"
import axiosInstance from "../axios/axiosInstance"
import { useNavigate, useParams } from "react-router-dom"
import ReactImageMagnify from "react-image-magnify"
import { useMediaQuery } from "react-responsive"
import Loading from "../util_components/Loading"

export default function ShopItemDetails() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const { setCartItemCount } = useContext(CartCountContext)
  const { productId } = useParams()
  const isInside992px = useMediaQuery({query: "(max-width: 992px)"})
  const [isLoading, setIsLoading] = useState(true)
  const [productData, setProductData] = useState({imageUrl: "", name: "", brand: "", type: "", price: "", quantity: 0, specs: {}})
  let specs = []
  const [quantity, setQuantity] = useState(1)
  for (const [key, value] of Object.entries(productData.specs)) {
    specs.push({ key: key, value: value })
  }

  useEffect(() => {
    const abortController = new AbortController()
    if(isLoading){
      const loadProduct = async () => {
        try {
          const response = await axiosInstance.post("server/db_queries/product_fetch.php", JSON.stringify({ id: productId }), { 
            signal: abortController.signal 
          })
          setIsLoading(false)
          setProductData({imageUrl: response.data["image_path"], name: response.data["product_name"], brand: response.data["brand"],
            type: response.data["product_type"], price: response.data["price"], quantity: response.data["current_amount"], 
            specs: JSON.parse(response.data["specifications"])})
        }
        catch(error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsLoading(false)
          alert(error)
        }
      }
      loadProduct()
    }
    return () => abortController.abort()
  }, [isLoading])

  function addToCart(){
    const product = {
      id: productId,
      quantity: quantity
    }
    let storageData = null
    try {
      storageData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
      if(!Array.isArray(storageData)) {
        throw new Error()
      }
    }
    catch(error) {
      storageData = []
      localStorage.setItem("cart", JSON.stringify(storageData))
    }
    localStorage.setItem("cart", JSON.stringify([...storageData.filter(v => v.id !== productId), product]))
    setCartItemCount(JSON.parse(localStorage.getItem("cart")).length)
    navigate("/")
  }
  
  return (
    <>
      { 
        isLoading ? <Loading /> : 
        <div className="shop-item-details">
          <div className="shop-item-details__first-section">
            <div className="shop-item-details__first-section__image">
              {!isInside992px ? <ReactImageMagnify {...{
                  smallImage: {
                    alt: "Missing",
                    isFluidWidth: true,
                    src: productData.imageUrl
                  },
                  largeImage: {
                    src: productData.imageUrl,
                    width: 1600,
                    height: 1600
                  },
                  enlargedImageContainerDimensions: {
                    width: "100%",
                    height: "80%"
                  },
                  imageClassName: "shop-item-details__first-section__image__small"
              }} /> : <img src={productData.imageUrl} alt="Missing" />}
            </div>
            <h1>{productData.name}</h1>
          </div>
          <div className="shop-item-details__second-section">
            <div>
              <span>Brand: </span>
              <strong>{productData.brand}</strong>
            </div>
            <div>
              <span>Type: </span>
              <strong>{productData.type}</strong>
            </div>
            <div>
              <h4>Specifications:</h4>
              {specs.map((v) => <div key={v.key} className="shop-item-details__second-section__specs"><span>{v.key + ": "}</span>
                <strong>{v.value === true ? "Yes" : v.value === false ? "No" : v.value}</strong></div>)}
            </div>
            <div className="shop-item-details__second-section__item-count">
              <span>Quantity: </span>
              {
                user.role !== roles.employee ? 
                  productData.quantity > 0 ? <div className="shop-item-details__second-section__item-count__input">
                    <QuantityInput quantity={quantity} name="quantity" 
                      setQuantity={(e) => setQuantity(e.target.value < 1 ? 1 : e.target.value > productData.quantity ? productData.quantity : e.target.value)}  
                      increaseQuantity={() => setQuantity(prev => prev < productData.quantity ? prev + 1 : prev)} 
                      decreaseQuantity={() => setQuantity(prev => prev > 1 ? prev - 1 : prev)}/>
                  </div> : 
                    <strong className="shop-item-details__second-section__item-count_alt">Out of stock</strong> :
                  <strong>{productData.quantity}</strong>
              }
            </div>
            <div className="shop-item-details__second-section__price">
              <span>Price: </span>
              <strong>{(productData.price * quantity).toFixed(2)}$</strong>
            </div>
            {(user.role !== roles.employee && productData.quantity > 0) && <button onClick={() => addToCart()}>Add to cart</button>}
          </div>
        </div> 
      }
    </>
  )
}
