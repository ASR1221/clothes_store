/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react";
import { useQuery } from "react-query";

import fetchFn from "../../../../utils/fetchFn";

import Button from "../../../button/button";
import ItemDetailsComp from "../../../itemDetailsComp/itemDetailsComp";

import "./editCartItem.css";

// eslint-disable-next-line react/display-name
const EditCartItem = forwardRef(({ itemId, color, size, count, index, setCartItems }, ref) => {

   const [selectedColor, setSelectedColor] = useState(color);
   const [selectedSizes, setSelectedSizes] = useState([size]);
   const [selectedCount, setSelectedCount] = useState(count);

   const { isLoading, error, data } = useQuery(["itemDetails", itemId], () => fetchFn(`/items/details/${itemId}`, "GET"));

   function handleSaveClick() {
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      cartItems[index] = {
         ...cartItems[index],
         color: selectedColor,
         size: selectedSizes[0],
         count: selectedCount
      };
      setCartItems(cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      ref.current.close();
   }

   function handleRemoveClick() {
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      cartItems.splice(index, 1);
      setCartItems(cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      ref.current.close();
   }

   return (
      <dialog ref={ref} className="editDialog-container">
         <div className="editDialog-details-container">
            {
               error ? <p>{error}</p>
               : <ItemDetailsComp
                  data={data}
                  isLoading={isLoading}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  selectedCount={selectedCount}
                  setSelectedCount={setSelectedCount}
                  isSingle={true}
               />
            }
         </div>
         <div className="editDialog-actions-container flex">
            <Button
               text={"Save"}
               fn={handleSaveClick}
            />
            <Button
               text={"Remove"}
               fn={handleRemoveClick}
            />
         </div>
      </dialog>
   );
});

export default EditCartItem;
