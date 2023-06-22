import "./cart.css"

import CartItems from "../../components/cartItem/cartItems";

function Cart() {
   return <div className="cart-container">
      <div className="cart logo-container">
         <img className="img" src="/icons/asr-logo.svg" alt="ASR Logo" />
      </div>
      <h1 className="cart-h1">Cart</h1>
      <CartItems isEditable={true}/>
   </div>;
}

export default Cart;