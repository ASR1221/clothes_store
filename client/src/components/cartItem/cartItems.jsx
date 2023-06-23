/* eslint-disable react/prop-types */
import { useQuery } from "react-query";
import { useEffect, useRef, useState } from "react";

import fetchFn from "../../utils/fetchFn";

import Loading from "../loading/loading";
import CartItem from "./components/cartItem/cartItem";

import "./cartItems.css";

function CartItems({ isEditable }) {
   const [cartItems, setCartItems] = useState([]);
   const isSignedIn = useRef(localStorage.getItem("ssID") ? true : false);

   const { isLoading, error } = useQuery(
      ["cartItems"],
      () => fetchFn("/cart/list", "GET", localStorage.getItem("ssID")),
      {
         onSuccess: (data) => {
            setCartItems(
               data.map((item) => ({
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
               }))
            );
         },
      }
   );

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
         {isLoading && isSignedIn.current ? (
            <Loading />
         ) : error && isSignedIn.current ? (
            <div>
               <h2>Error</h2>
               <p>{error}</p>
            </div>
         ) : cartItems && cartItems.length > 0 ? (
            cartItems.map(itemFunction)
         ) : (
            <p>No Cart Items</p>
         )}
      </div>
   );
}

export default CartItems;