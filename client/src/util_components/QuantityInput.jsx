import "../styles/QuantityInput.css"

export default function QuantityInput({ quantity, setQuantity, increaseQuantity, decreaseQuantity }) {
  return (
    <>
      <button className="quantity-input__button" type="button" onClick={increaseQuantity}>+</button>
      <input className="quantity-input__input" type="number" value={quantity} onChange={setQuantity} />
      <button className="quantity-input__button" type="button" onClick={decreaseQuantity}>-</button>
    </>
  )
}
