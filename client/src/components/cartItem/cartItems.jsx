/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import CartItem from "./components/cartItem/cartItem";

import "./cartItems.css";

function CartItems({ isEditable }) {
   const [cartItems, setCartItems] = useState([]);

   useEffect(() => {
      if (localStorage.getItem("cartItems"))
         setCartItems(JSON.parse(localStorage.getItem("cartItems")));
   }, []);

   function itemFunction(cartItem, i) {
      return <CartItem
         cartItem={cartItem}
         index={i}
         isEditable={isEditable}
         setCartItems={setCartItems}
      />;
   }

   return (
      <div className="cartItems-container">
         {
            cartItems && cartItems.length > 0 ? (
               cartItems.map(itemFunction)
            ) : (
               <p>No Cart Items</p>
            )
         }
      </div>
   );
}

export default CartItems;