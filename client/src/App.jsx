import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Browse from "./routes/Browse";
import MainLayout from "./routes/main/MainLayout";
import Authentication from "./routes/Authentication";
import PurchaseHistory from "./routes/PurchaseHistory";
import Cart from "./routes/Cart";
import NewItem from "./routes/NewItem"
import Error from "./rerouting/error/Error";
import { createContext, useState } from "react";
import { authType, roles } from "./data/data";
import ProtectedRoute from "./rerouting/ProtectedRoute";
import ReactModal from "react-modal";
import Validate from "./rerouting/Validate";
import Redirect from "./rerouting/Redirect";
import ShopItemDetails from "./routes/ShopItemDetails";
import Orders from "./routes/Orders";

export const AuthContext = createContext(null)
export const CartCountContext = createContext(null)

export default function App() {
  const [user, setUser] = useState({ id: "", role: roles.guest, accessToken: "" })
  try {
    if(localStorage.getItem("cart")) {
      if(!Array.isArray(JSON.parse(localStorage.getItem("cart")))) {
        throw new Error()
      }
    }
  }
  catch(error) {
    localStorage.setItem("cart", JSON.stringify([]))
  }
  const [cartItemCount, setCartItemCount] = useState(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")).length : 0)
  const [isCookieAgreementDisplayed, setIsCookieAgreementDisplayed] = useState(true)

  return (
    <div className="App">
      <AuthContext.Provider value={{ user, setUser }}>
        <CartCountContext.Provider value={{ cartItemCount, setCartItemCount }}>
          <BrowserRouter>
            <Routes>
              <Route element={<Validate />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Browse />} />
                  <Route path="/new_product" element={
                      <ProtectedRoute permittedRoles={[roles.employee]}>
                        <NewItem />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/cart" element={
                      <ProtectedRoute permittedRoles={[roles.user, roles.guest]}>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/purchase_history" element={
                      <ProtectedRoute permittedRoles={[roles.user]}>
                        <PurchaseHistory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/orders" element={
                      <ProtectedRoute permittedRoles={[roles.employee]}>
                        <Orders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/products/:productId" element={<ShopItemDetails />} />
                </Route>
                <Route element={<Redirect />}>
                  <Route path="/login" element={<Authentication role={roles.user} type={authType.login} />} />
                  <Route path="/register" element={<Authentication role={roles.user} type={authType.registration} />} />
                  <Route path="/employee_login" element={<Authentication role={roles.employee} type={authType.login} />} />
                </Route>
              </Route>
              <Route path="/unauthorized" element={<Error text="You are unauthorized to view this page." />} />
              <Route path="/forbidden" element={<Error text="Your access to this page is forbidden." />} />
              <Route path="*" element={<Error text="Page is not found." />} />
            </Routes>
          </BrowserRouter>
          {
            localStorage.getItem("cookie_agreement") ? <></> :
              <ReactModal id="cookies" appElement={document.getElementById("root")} isOpen={isCookieAgreementDisplayed} contentLabel="Cookie agreement">
                <span>Do you accept cookies: </span>
                <button onClick={() => { localStorage.setItem("cookie_agreement", "accepted"); setIsCookieAgreementDisplayed(false) }}>Accept</button>
                <button onClick={() => { localStorage.setItem("cookie_agreement", "declined"); setIsCookieAgreementDisplayed(false) }}>Decline</button>
              </ReactModal>
          }
        </CartCountContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}
