import "../styles/Browse.css"
import { Fragment, useContext, useEffect, useState } from "react"
import Filter from "../util_components/Filter"
import ModifyShopItem from "../items/ModifyShopItem"
import { convertObjectToList, productBrands, productTypes, roles } from "../utils/utils"
import { AuthContext } from "../App"
import ShopItem from "../items/ShopItem"
import Loading from "../util_components/Loading"
import axiosInstance from "../axios/axiosInstance"

export default function Browse() {
  const { user } = useContext(AuthContext)
  const [filterData, setFilterData] = useState({ bottomPrice: "", topPrice: "", selectedComponents: [], selectedBrands: [] })
  const [searchName, setSearchName] = useState("")
  const [result, setResult] = useState([]);
  const [isSearched, setIsSearched] = useState(false)
  const [isFiltered, setIsFiltered] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()
    if (!isFiltered) {
      const data = {
        name: searchName,
        filterData: {
          bottomPrice: filterData.bottomPrice,
          topPrice: filterData.topPrice || 999999,
          components: filterData.selectedComponents.length !== 0 ? filterData.selectedComponents : productTypes,
          brands: filterData.selectedBrands.length !== 0 ? filterData.selectedBrands : productBrands
        }
      }
      const filter = async () => {
        try {
          const response = await axiosInstance.post("/server/db_queries/products_fetch.php", 
            JSON.stringify({ ...data, searchType: "filter" }),
            {
              signal: abortController.signal
          })
          setIsFiltered(true)
          setResult(response.data)
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsFiltered(true)
          alert(error)
        }
      }
      filter()
    }
    return () => abortController.abort()
  }, [isFiltered])

  useEffect(() => {
    const abortController = new AbortController()
    if (!isSearched) {
      const search = async () => {
        try {
          const response = await axiosInstance.post("/server/db_queries/products_fetch.php", 
            JSON.stringify({ name: searchName, searchType: "name" }),
            {
              signal: abortController.signal
          })
          setIsSearched(true)
          setResult(response.data)
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED") {
            return
          }
          setIsSearched(true)
          alert(error)
        }
      }
      search()
    }
    return () => abortController.abort()
  }, [isSearched])

  return (
    <div id="browse">
      <div className="browse__search">
        <input type="text" id="search" placeholder="Insert product name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <button className="button" onClick={() => { searchName === "" ? alert("Insert product name please") : setIsSearched(false) }}>Search</button>
      </div>
      <div id="browse__main-section">
        <div id="filter">
          <Filter filterData={filterData} setFilterData={setFilterData}
            search={() => { searchName === "" ? alert("Insert product name please") : setIsFiltered(false) }}
          />
        </div>
        <div id="browse__shop-items">
          {
            (!isFiltered || !isSearched) ?
              <Loading /> :
              result.length !== 0 ?
                user.role === roles.employee ?
                  result.map((v) =>
                    <Fragment key={v.id}><ModifyShopItem id={v.id} imageUrl={v.image_path} name={v.product_name} type={v.product_type}
                      brand={v.brand} specs={convertObjectToList(JSON.parse(v.specifications))} price={v.price} quantity={v.current_amount} 
                      removeProduct={() => setResult((prev) => prev.filter((value) => value.id !== v.id))}/></Fragment>) :
                  result.map((v) => 
                    <Fragment key={v.id}><ShopItem id={v.id} imageUrl={v.image_path} name={v.product_name} price={v.price} /></Fragment>) :
                <div className="browse__shop-items__no-result"><h1>No results</h1></div>
          }
        </div>
      </div>
    </div>
  )
}
