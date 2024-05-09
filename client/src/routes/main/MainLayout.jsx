import "../../styles/MainLayout.css"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext, CartCountContext } from "../../App"
import { roles } from "../../utils/utils"
import ReactModal from "react-modal"
import useLogout from "../../hooks/useLogout"
import useRefreshIntercept from "../../hooks/useRefreshIntercept"

export default function MainLayout() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const interceptedInstance = useRefreshIntercept()
  const logout = useLogout()
  const { cartItemCount } = useContext(CartCountContext)
  const buttonRef = useRef()
  const [areOptionsOpened, setAreOptionsOpened] = useState(false)
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
  const [passwords, setPasswords] = useState({ new: "", repeatedNew: "" })
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  useEffect(() => {
    function cancelOptions(e) {
      if (buttonRef.current !== e.target) {
        setAreOptionsOpened(false)
      }
    }
    window.addEventListener("click", cancelOptions)
    return () => window.removeEventListener("click", cancelOptions)
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    if (isPasswordChangeLoading) {
      setErrorText("")
      const changePassword = async () => {
        try {
          const response = await interceptedInstance.post("/server/db_queries/credentials/change_password.php",
           JSON.stringify({ password: passwords.new, id: user.id, role: user.role }),
            { signal: abortController.signal }
          )
          setIsPasswordChangeLoading(false)
          setIsChangePasswordDialogOpen(false)
          logout()
          navigate(user.role === roles.employee ? "/employee_login" : "/login", { state: { previousLocation: location }, replace: true })
        }
        catch (error) {
          if(error?.code === "ERR_CANCELED"){
            return
          }
          setIsPasswordChangeLoading(false)
          if (error.response?.status === 401) {
            setUser({ id: "", role: roles.guest, accessToken: "" })
            navigate(user.role === roles.employee ? "/employee_login" : "/login", { state: { previousLocation: location }, replace: true })
          }
          else if (error.response?.status === 403) {
            navigate("/")
            window.location.reload()
          }
          else {
            alert(error)
          }
        }
      }
      if (passwords.new !== passwords.repeatedNew) {
        setIsPasswordChangeLoading(false)
        setErrorText("Passwords must match")
      }
      else {
        changePassword()
      }
    }
    return () => abortController.abort()
  }, [isPasswordChangeLoading])

  return (
    <>
      <div id="optionbar">
        <h1 onClick={() => navigate("/")}>Tech webshop</h1>
        <nav>
          {
            (user.role === roles.guest || user.role === roles.user) &&
            <NavLink to="/cart">
              <button className="cart-button">Cart {cartItemCount === 0 ? "" : `(${cartItemCount})`}</button>
            </NavLink>
          }
          {user.role === roles.guest && <NavLink to="/login"><button>Login</button></NavLink>}
          {user.role === roles.guest && <NavLink to="/register"><button>Register</button></NavLink>}
          {user.role === roles.employee && <NavLink to="/new_product"><button>Add new product</button></NavLink>}
          {user.role === roles.employee && <NavLink to="/orders"><button>Orders</button></NavLink>}
          {user.role !== roles.guest &&
            <div className="optionbar__profile"><button ref={buttonRef} onClick={() => setAreOptionsOpened(true)}>Profile</button>
              {
                areOptionsOpened &&
                <ul className="optionbar__profile__options">
                  <li onClick={() => setIsChangePasswordDialogOpen(true)}>Change password</li>
                  {user.role === roles.user && <li onClick={() => navigate("/purchase_history")}>Purchase History</li>}
                  <li onClick={() => logout()}>Log out</li>
                </ul>
              }
            </div>
          }
        </nav>
      </div>
      <main>
        <Outlet />
        <ReactModal id="password_change" appElement={document.getElementById("root")}
          isOpen={isChangePasswordDialogOpen} contentLabel="Pasword change" onRequestClose={() => setErrorText("")}>
          <h2>Change password</h2>
          <div>
            <span>New password: </span>
            <input type="password" value={passwords.new} onChange={(e) => setPasswords((prev) => { return { ...prev, new: e.target.value } })} required />
          </div>
          <div>
            <span>Repeat new password: </span>
            <input type="password" value={passwords.repeatedNew} onChange={(e) => setPasswords((prev) => { return { ...prev, repeatedNew: e.target.value } })} required />
          </div>
          <div>
            <button onClick={() => setIsPasswordChangeLoading(true)}>Confirm</button>
            <button onClick={() => setIsChangePasswordDialogOpen(false)}>Cancel</button>
          </div>
          {errorText && <h3>{errorText}</h3>}
        </ReactModal>
      </main>
      <footer />
    </>
  )
}
