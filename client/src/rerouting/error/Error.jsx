import "../../styles/Error.css"

export default function Error(props) {
  return (
    <div className="error">
      <h1>{props.text}</h1>
    </div>
  )
}
