import "../styles/Filter.css"
import { productBrands, productTypes } from "../data/data"

export default function Filter(props) {
  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); props.search() }}>
        <div className="filter-section">
          <details>
            <summary>Price</summary>
            <div className="filter-section__details">
              <div className="filter-section__details__item">
                <span>From:</span>
                <input type="number" className="filter-section__details__item__price-input" value={props.filterData.bottomPrice}
                  onChange={(e) => props.setFilterData((prev) => { return { ...prev, bottomPrice: e.target.value } })}
                />
                <span>$</span>
              </div>
              <div className="filter-section__details__item">
                <span>To:</span>
                <input type="number" className="filter-section__details__item__price-input" value={props.filterData.topPrice}
                  onChange={(e) => props.setFilterData((prev) => { return { ...prev, topPrice: e.target.value } })}
                />
                <span>$</span>
              </div>
            </div>
          </details>
        </div>
        <div className="filter-section">
          <details>
            <summary>Component</summary>
            <div className="filter-section__details">
              {
                productTypes.map((v) =>
                  <div className="filter-section__details__item" key={v}>
                    <label htmlFor={v}>{v}</label>
                    <input type="checkbox" id={v}
                      onChange={() => props.filterData.selectedComponents.includes(v) ?
                        props.setFilterData((prev) => { return { ...prev, selectedComponents: prev.selectedComponents.filter(element => element !== v) } }) :
                        props.setFilterData((prev) => { return { ...prev, selectedComponents: [...prev.selectedComponents, v] } })
                      }
                    />
                  </div>
                )
              }
            </div>
          </details>
        </div>
        <div className="filter-section">
          <details>
            <summary>Brand</summary>
            <div className="filter-section__details">
              {
                productBrands.map((v) =>
                  <div className="filter-section__details__item" key={v}>
                    <label htmlFor={v}>{v}</label>
                    <input type="checkbox" id={v}
                      onChange={() => props.filterData.selectedBrands.includes(v) ?
                        props.setFilterData((prev) => { return { ...prev, selectedBrands: prev.selectedBrands.filter(element => element !== v) } }) :
                        props.setFilterData((prev) => { return { ...prev, selectedBrands: [...prev.selectedBrands, v] } })
                      }
                    />
                  </div>
                )
              }
            </div>
          </details>
        </div>
        <div className="filter-section">
          <button type="submit">Apply filter</button>
        </div>
      </form>
    </>
  )
}
