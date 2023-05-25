import { useContext, useEffect } from "react"
import { AuthContext } from "../App"
import { Outlet, useNavigate } from "react-router-dom"
import { roles } from "../utils/Utils"

export default function Redirect() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user.role !== roles.guest) {
      navigate("/")
    }
  }, [])

  return (
    <Outlet />
  )
}