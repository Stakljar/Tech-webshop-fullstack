import "../../styles/Error.css"

export default function Error(props) {
  return (
    <div className="error">
      <h1>
        {props.title}
      </h1>
      <span>{props.description}</span>
    </div>
  )
}
