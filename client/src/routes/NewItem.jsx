import "../styles/NewItem.css"
import { useContext, useEffect, useState } from "react"
import QuantityInput from "../util_components/QuantityInput"
import { productTypes, productBrands, roles } from "../data/data"
import { useLocation, useNavigate } from "react-router-dom"
import useRefreshIntercept from "../hooks/useRefreshIntercept"
import { AuthContext } from "../App"

export default function NewItem() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const interceptedInstance = useRefreshIntercept()
  const fileReader = new FileReader()
  const [productImage, setProductImage] = useState("")
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("Desktop Computer")
  const [productBrand, setProductBrand] = useState("ASUS")
  const [productPrice, setProductPrice] = useState(0)
  const [productQuantity, setProductQuantity] = useState(1)
  const [isAddingProductLoading, setIsAddingProductLoading] = useState(false)

  const [desktopComputerSpecs, setDesktopComputerSpecs] = useState({ CPU: "", GPU: "", RAM: "", Motherboard: "", Storage: "", PSU: "" })
  const [laptopSpecs, setLaptopSpecs] = useState({ CPU: "", GPU: "", RAM: "", Motherboard: "", Storage: "", Resolution: "", "Refresh rate (Hz)": "" })
  const [monitorSpecs, setMonitorSpecs] = useState({ Resolution: "", "Refresh rate (Hz)": "" })
  const [headphonesSpecs, setHeadphonesSpecs] = useState({ Wireless: false })
  const [mouseSpecs, setMouseSpecs] = useState({ Wireless: false, "Pooling rate (Hz)": "", DPI: "" })
  const [keyboardSpecs, setKeyboardSpecs] = useState({ Wireless: false, Mechanical: false })
  const [mousepadSpecs, setMousepadSpecs] = useState({ Size: "" })

  function clearAllSpecs() {
    setDesktopComputerSpecs({ CPU: "", GPU: "", RAM: "", Motherboard: "", Storage: "", PSU: "" })
    setLaptopSpecs({ CPU: "", GPU: "", RAM: "", Motherboard: "", Storage: "", Resolution: "", "Refresh rate (Hz)": "" })
    setMonitorSpecs({ Resolution: "", "Refresh rate (Hz)": "" })
    setHeadphonesSpecs({ Wireless: false })
    setMouseSpecs({ Wireless: false, "Pooling rate (Hz)": "", DPI: "" })
    setKeyboardSpecs({ Wireless: false, Mechanical: false })
    setMousepadSpecs({ Size: "" })
  }

  function getSpecsState() {
    if (productType === "Desktop Computer") {
      return desktopComputerSpecs
    }
    else if (productType === "Laptop") {
      return laptopSpecs
    }
    else if (productType === "Monitor") {
      return monitorSpecs
    }
    else if (productType === "Headphones") {
      return headphonesSpecs
    }
    else if (productType === "Mouse") {
      return mouseSpecs
    }
    else if (productType === "Keyboard") {
      return keyboardSpecs
    }
    else
      return mousepadSpecs
  }

  function getSpecsSetState() {
    if (productType === "Desktop Computer") {
      return setDesktopComputerSpecs
    }
    else if (productType === "Laptop") {
      return setLaptopSpecs
    }
    else if (productType === "Monitor") {
      return setMonitorSpecs
    }
    else if (productType === "Headphones") {
      return setHeadphonesSpecs
    }
    else if (productType === "Mouse") {
      return setMouseSpecs
    }
    else if (productType === "Keyboard") {
      return setKeyboardSpecs
    }
    else
      return setMousepadSpecs
  }

  function getSpecs() {
    if (productType === "Desktop Computer") {
      return [
        { key: "CPU", inputType: "text" },
        { key: "GPU", inputType: "text" },
        { key: "RAM", inputType: "text" },
        { key: "Motherboard", inputType: "text" },
        { key: "Storage", inputType: "text" },
        { key: "PSU", inputType: "text" }
      ]
    }
    else if (productType === "Laptop") {
      return [
        { key: "CPU", inputType: "text" },
        { key: "GPU", inputType: "text" },
        { key: "RAM", inputType: "text" },
        { key: "Motherboard", inputType: "text" },
        { key: "Storage", inputType: "text" },
        { key: "Resolution", inputType: "text" },
        { key: "Refresh rate (Hz)", inputType: "number" }
      ]
    }
    else if (productType === "Monitor") {
      return [{ key: "Resolution", inputType: "text" }, { key: "Refresh rate (Hz)", inputType: "number" }]
    }
    else if (productType === "Headphones") {
      return [{ key: "Wireless", inputType: "checkbox" }]
    }
    else if (productType === "Mouse") {
      return [
        { key: "Wireless", inputType: "checkbox" },
        { key: "Pooling rate (Hz)", inputType: "number" },
        { key: "DPI", inputType: "number" }
      ]
    }
    else if (productType === "Keyboard") {
      return [
        { key: "Wireless", inputType: "checkbox" },
        { key: "Mechanical", inputType: "checkbox" },
      ]
    }
    else
      return [{ key: "Size", inputType: "text" }]
  }

  useEffect(() => {
    if (isAddingProductLoading) {
      const abortController = new AbortController()
      const postProduct = async () => {
        try {
          await interceptedInstance.post("/server/db_queries/product_insert.php", JSON.stringify({
            id: user.id,
            role: user.role, image: productImage, name: productName, brand: productBrand, type: productType,
            price: productPrice, quantity: productQuantity, specs: JSON.stringify(getSpecsState())
          }), {
            signal: abortController.signal,
            headers: {
              "Authorization": "Bearer " + user.accessToken
            }
          })
          setIsAddingProductLoading(false)
          navigate("/")
        }
        catch (error) {
          if (error?.code === "ERR_CANCELED") {
            return
          }
          setIsAddingProductLoading(false)
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
      postProduct()
    }
    return () => abortController.abort()
  }, [isAddingProductLoading])

  return (
    <form id="new-item" onSubmit={(e) => { e.preventDefault(); setIsAddingProductLoading(true) }}>
      <div id="new-item__image">
        <h2>Product image</h2>
        <input type="file" accept="image/*" name="image" onChange={(e) => {
          fileReader.readAsDataURL(e.target.files[0])
          fileReader.onload = (e) => setProductImage(e.target.result)
        }} />
        {
          productImage &&
          <div>
            <img src={productImage} alt="Missing" />
          </div>
        }
      </div>
      <div>
        <h2>Product name</h2>
        <input type="text" value={productName} name="name" onChange={(e) => {
          setProductName(prev => e.target.value.length > 50 ? prev : e.target.value)
        }} required />
      </div>
      <div>
        <h2>Product type</h2>
        <select value={productType} name="type" onChange={(e) => {
          clearAllSpecs();
          setProductType(e.target.value)
        }} >
          {productTypes.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <h2>Product brand</h2>
        <select value={productBrand} name="brand" onChange={(e) => {
          setProductBrand(e.target.value)
        }}>
          {productBrands.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <h2>Product price ($)</h2>
        <input type="number" value={productPrice} name="price" onChange={e => {
          setProductPrice(e.target.value > 99999 ? 99999 : e.target.value < 0 ? 0 : e.target.value)
        }} required />
      </div>
      <div>
        <h2>Quantity: </h2>
        <QuantityInput quantity={productQuantity} name="quantity" setQuantity={(e) => setProductQuantity(e.target.value < 0 ? 0 : e.target.value)}
          increaseQuantity={() => setProductQuantity(prev => prev + 1)} decreaseQuantity={() => setProductQuantity(prev => prev > 0 ? prev - 1 : prev)} />
      </div>
      <div>
        <h2>Specifications</h2>
        {
          getSpecs().map((v) => <div key={v.key} className="new-item__new-spec">
            <input type="text" className={v.inputType === "checkbox" ? "new-item__new-spec__checkbox-label" : "new-item__new-spec__others-label"}
              value={v.key} disabled />
            {
              v.inputType !== "checkbox" ?
                <input type={v.inputType} name={v.key} value={getSpecsState()[v.key]}
                  onChange={(e) => { (getSpecsSetState())((prev) => { return { ...prev, [e.target.name]: e.target.value.length > 50 ? prev[e.target.name] : e.target.value } }) }}
                  placeholder="Input specification value..." required /> :
                <input type={v.inputType} name={v.key} checked={getSpecsState()[v.key]}
                  onChange={(e) => { (getSpecsSetState())((prev) => { return { ...prev, [e.target.name]: !prev[e.target.name] } }) }} />
            }
          </div>
          )
        }
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}