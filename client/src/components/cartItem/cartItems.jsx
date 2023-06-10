import "./cartItems.css";

import { useMemo } from "react";

function CartItems() {

   const cartItems = useMemo(() => {
      if (localStorage.getItem("cartItems"))
         return JSON.parse(localStorage.getItem("cartItems"))
   }, []);

   function handleEditClick() {
      
   }

   return <div className="cartItems-container">
      {cartItems && cartItems.map((cartItem, i) => <div className="grid cartItem-container" key={i}>
            <div className="cartItem-img-container">
               <img className="img" src={cartItem.img} alt="Item image" />
            </div>
            <div className="grid cartItem-details-container">
               <p className="cartItem-name">{ cartItem.name }</p>
               <div className="flex cartItem-sizeColor">
                  <div className="cartItem-color" style={{backgroundColor: cartItem.color}}></div>
                  <p>Size: { cartItem.size }</p>
                  <p>Count: { cartItem.count }</p>
               </div>
               <p className="cartItem-price">Total Price: <span>{ cartItem.price * cartItem.count }$</span></p>
            </div>
            <button type="button" onClick={handleEditClick} className="cartItem-edit-btn">
               <img src="../../../public/icons/icons8-edit.svg" alt="edit image" />
            </button>
         </div>)
      }
   </div>;
}

export default CartItems;