import { useContext } from "react"
import { AuthContext } from "../App"
import { Navigate } from "react-router-dom"
import { roles } from "../utils/Utils"

export default function ProtectedRoute({ permittedRoles, children }) {
  const currentUser = useContext(AuthContext)
  return (
    <>
      {permittedRoles.includes(currentUser.user.role) ? children : currentUser.user.role === roles.guest ? <Navigate to="/unauthorized" /> : <Navigate to="/forbidden" />}
    </>
  )
}
