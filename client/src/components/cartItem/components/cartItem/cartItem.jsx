import { useRef } from "react";

import EditCartItem from "../editCartItem/editCartItem";

//! styles are in 'cartItems.css'

/* eslint-disable react/prop-types */
function CartItem({ cartItem, index, isEditable, setCartItems }) {
   const editRef = useRef();

   function handleEditClick() {
      editRef.current.showModal();
   }

   return (
      <div className="grid cartItem-container" key={index}>
         <div className="cartItem-img-container">
            <img className="img" src={cartItem.img} alt="Item image" />
         </div>
         <div className="grid cartItem-details-container">
            <p className="cartItem-name">{cartItem.name}</p>
            <div className="flex cartItem-sizeColor">
               <div
                  className="cartItem-color"
                  style={{ backgroundColor: cartItem.color }}
               ></div>
               <p>Size: {cartItem.size}</p>
               <p>Count: {cartItem.item_count}</p>
            </div>
            <p className="cartItem-price">
               Total Price: <span>{cartItem.price * cartItem.item_count}$</span>
            </p>
         </div>
         {isEditable && (
            <button
               type="button"
               onClick={handleEditClick}
               className="cartItem-edit-btn"
            >
               <img
                  src="../../../public/icons/icons8-edit.svg"
                  alt="edit icon"
               />
            </button>
         )}
         <EditCartItem
            itemId={cartItem.itemId}
            color={cartItem.color}
            size={cartItem.size}
            count={cartItem.item_count}
            index={index}
            setCartItems={setCartItems}
            ref={editRef}
         />
      </div>
   );
}

export default CartItem;
