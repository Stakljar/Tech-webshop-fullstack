import "../styles/CartItem.css"

export default function CartItem(props) {

  return (
    <div className="cart-item">
      <img src={props.imageSource} alt="Missing" />
      <h2>{props.name}</h2>
      <div className="cart-item__quantity">
        <span>Quantity: </span><strong>{props.quantity}</strong>
      </div>
      <div className="cart-item__price">
        <span>Price: <strong>{props.price * props.quantity}$</strong></span>
      </div>
      <button onClick={() => { props.removeProduct() }}>Remove</button>
    </div>
  )
}
