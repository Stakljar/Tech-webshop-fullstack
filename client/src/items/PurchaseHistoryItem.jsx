import "../styles/PurchaseHistoryItem.css"

export default function PurchaseHistoryItem(props) {
  return (
    <>
      <div className="purchase-history-item">
        <h3>Name: {props.name}</h3>
        <div>
          <span>Price: </span><strong>{props.price * props.quantity}$</strong>
        </div>
        <div>
          <span>Quantity: </span><strong>{props.quantity}</strong>
        </div>
        <div>
          <span>Date of purchase: </span><strong>{props.date}</strong>
        </div>
      </div>
      <hr/>
    </>
  )
}
