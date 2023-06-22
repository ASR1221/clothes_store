import { useQuery } from "react-query";
import { useEffect, useRef, useState } from "react";

import fetchFn from "../../utils/fetchFn";

import Loading from "../loading/loading";

import "./cartItems.css";

function CartItems({ isEditable }) {

   const [cartItems, setCartItems] = useState([]);
   const isSignedIn = useRef(localStorage.getItem("ssID") ? true : false);

   const { isLoading, error } = useQuery(["cartItems"], () => fetchFn("/cart/list", "GET"), {
      onSuccess: (data) => {
         setCartItems(data.map(item => ({
            id: item.id,
            item_count: item.iteem_count,
            total_price: item.total_price,
            ItemDetailsId: item.itemDtail.id,
            size: item.itemDtail.size,
            color: item.itemDtail.color,
            stock: item.itemDtail.stock,
            name: item.itemDtail.item.name,
            price: item.itemDtail.item.price,
            img: item.img,
         })));
      }
   });

   useEffect(() => {
      if (localStorage.getItem("cartItems"))
         setCartItems(JSON.parse(localStorage.getItem("cartItems")));
   }, []);

   function handleEditClick() {
      
   }

   function itemFunction(cartItem, i) {
      return <div className="grid cartItem-container" key={i}>
         <div className="cartItem-img-container">
            <img className="img" src={cartItem.img} alt="Item image" />
         </div>
         <div className="grid cartItem-details-container">
            <p className="cartItem-name">{ cartItem.name }</p>
            <div className="flex cartItem-sizeColor">
               <div className="cartItem-color" style={{backgroundColor: cartItem.color}}></div>
               <p>Size: { cartItem.size }</p>
               <p>Count: { cartItem.item_count }</p>
            </div>
            <p className="cartItem-price">Total Price: <span>{ cartItem.price * cartItem.item_count }$</span></p>
         </div>
         {
            isEditable && <button type="button" onClick={handleEditClick} className="cartItem-edit-btn">
               <img src="../../../public/icons/icons8-edit.svg" alt="edit icon" />
            </button>
         }
      </div>
   }

   return <div className="cartItems-container">
      {
         isLoading && isSignedIn.current ? <Loading />
         : error && isSignedIn.current ? <div>
            <h2>Error</h2>
            <p>{ error }</p>
         </div>
         : cartItems && cartItems.length > 0 ? cartItems.map(itemFunction)
         : <p>No Cart Items</p>
      }
   </div>;
}

export default CartItems;