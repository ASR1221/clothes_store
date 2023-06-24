import { useRef } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import fetchFn from "../../utils/fetchFn";

import CartItems from "../../components/cartItem/cartItems";
import Loading from "../../components/loading/loading";
import Button from "../../components/button/button";

import "./cart.css";

function Cart() {

   const isSignedIn = useRef(localStorage.getItem("ssID") ? true : false);
   const totalCheck = useRef(0);

   const { isLoading, error } = useQuery(
      ["cartItems"],
      () => fetchFn("/cart/list", "GET", localStorage.getItem("ssID")),
      {
         onSuccess: (data) => {
            totalCheck.current = 0;
            localStorage.setItem("cartItems",
               JSON.stringify(data.map(item => {
                  totalCheck.current += item.item_count * item.itemsDetail.item.price;
                  return {
                     id: item.id,
                     item_count: item.item_count,
                     itemDetailsId: item.itemsDetail.id,
                     size: item.itemsDetail.size,
                     color: item.itemsDetail.color,
                     name: item.itemsDetail.item.name,
                     price: item.itemsDetail.item.price,
                     itemId: item.itemsDetail.item.id,
                     img: item.itemsDetail.item.image_path,
                  };
               }))
            );
         },
      }
   );

   const navigate = useNavigate();

   function handleMakeOrderClick() {
      if (!isSignedIn) {
         navigate("/login");
         return;
      }

   }

   return <div className="cart-container">
      <div className="cart logo-container">
         <img className="img" src="/icons/asr-logo.svg" alt="ASR Logo" />
      </div>
      <h1 className="cart-h1">Cart</h1>
      {
         isLoading && isSignedIn.current ? (
            <Loading />
         ) : error && isSignedIn.current ? (
            <div>
               <h2>Error</h2>
               <p>{error}</p>
            </div>
         ) : < CartItems isEditable={true}/>
      }
      <div className="cart-check-container flex">
         <p>Total Check: { totalCheck.current }$</p>
         <Button
            text={"Make Order"}
            fn={handleMakeOrderClick}
         />
      </div>
   </div>;
}

export default Cart;