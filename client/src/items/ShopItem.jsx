import { useNavigate } from "react-router-dom"
import "../styles/ShopItem.css"

export default function ShopItem(props) {
  const navigate = useNavigate()

  return (
    <div className="shop-item">
      <img src={props.imageUrl} />
      <div className="shop-item__additional">
        <h3>{props.name}</h3>
        <hr/>
        <div className="shop-item__additional__options">
          <span>Price: {props.price}$</span>
          <button onClick={() => navigate(`/products/${props.id}`)}>View more</button>
        </div>
      </div>
    </div>
  )
}
