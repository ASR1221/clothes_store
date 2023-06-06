import "./itemDetails.css";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState, useRef, useContext } from "react";

import fetchFn from "../../utils/fetchFn";

import Items from "../../components/items/items";
import FilterBtn from "../../components/filterBtn/filterBtn";
import Button from "../../components/button/button";
import { dialogContext } from "../../context/dialogContext.js";

// TODO: mutation and loading states

function ItemDetails() {

   const { id } = useParams();

   const {
      isLoading,
      isFetching,
      isSuccess,
      error: queryError,
      data,
   } = useQuery(["item", id], () => fetchFn(`/items/details/${id}`, "GET"));

   const colorSize = useRef({});
   const [selectedImg, setSelectedImg] = useState("");
   const [selectedColor, setSelectedColor] = useState("");
   const [selectedSizes, setSelectedSizes] = useState([]);
   const [selectedCount, setSelectedCount] = useState(0);
   const [isCountError, setIsCountError] = useState(0);

   const showDialog = useContext(dialogContext);

   function handleImgClick(e) {
      const containers = document.querySelectorAll(".itemDetails-smallImg-container");
      for (let i = 0; i < containers.length; i++) {
         containers[i].classList.remove("selected");
      }
      e.target.parentElement.classList.add("selected"); // the event is for the child for some reason. /:
      setSelectedImg(e.target.src);
   }

   function handleColorClick(e) {
      const containers = document.querySelectorAll(".itemDetails-color-border");
      for (let i = 0; i < containers.length; i++) {
         containers[i].classList.remove("selected");
      }
      e.target.parentElement.classList.add("selected"); // the event is for the child for some reason. /:
      setSelectedColor(e.target.style.backgroundColor);
      setSelectedSizes([]);
   }

   function handleAddToCart() {
      const previous = JSON.parse(localStorage.getItem("cartItems"));
      const items = [1];
      if (previous) {
         items.push(...previous);
      }
      localStorage.setItem("cartItems", JSON.stringify(items));
      showDialog("Cart Item Added");
   }
   

   useEffect(() => {

      if (selectedSizes.length < 1) {
         setIsCountError(1);
         return;
      }

      if (!selectedCount) {
         setIsCountError(1);
         return;
      }

      let changed = false;
      data?.itemDetails.forEach((detail) => {
         if ((detail.color === selectedColor)) {
            if (selectedSizes.includes(detail.size)) {
               if (selectedCount > detail.stock) {
                  setIsCountError(detail.stock);
                  changed = true;
               }
            }
         }
      });

      if (!changed) {
         setIsCountError(0);
      }

   }, [data, selectedCount, selectedColor, selectedSizes]);

   useEffect(() => {

      if (queryError) {
         showDialog(queryError.message);
      } /* else if (isMutationError) {
         showDialog(mutationError.message);
      } */ else if (isCountError && !selectedSizes.length < 1 && selectedCount) {
         showDialog(`Sorry, we only have ${isCountError} of one of your selected sizes`);
      } 

   }, [queryError/* , isMutationError */, isCountError]);

   useEffect(() => {

      if (Object.keys(colorSize.current).length > 0) {
         return;
      }

      setSelectedImg(data?.images[0]);

      data?.itemDetails.forEach(detail => {

         if (!Object.keys(colorSize.current).includes(detail.color)) {
            colorSize.current[detail.color] = [detail.size];
         } else {
            colorSize.current[detail.color] = [...colorSize.current[detail.color], detail.size];
         }
      });

      setSelectedColor(Object.keys(colorSize.current)[0])

      return () => 
         colorSize.current = {};

   }, [data]);

   return <div className="itemDetails-container">
      <div className="logo-container">
         <img className="img" src="/icons/asr-logo.svg" alt="ASR Logo" />
      </div>
      <section className="grid itemDetails-imgs-container responsive-margin">
         <div className="itemDetails-mainImg-container">
            <img className="img" src={selectedImg} alt="selected item image" />
         </div>
         <div className="grid itemDetails-smallImgs-container">
            {
               data?.images.map((img, i) => <div
                  key={i}
                  onClick={handleImgClick}
                  className={`itemDetails-smallImg-container ${selectedImg === img ? "selected" : ""}`}
               >
                  <img className="img" src={img} alt="item image" />
               </div>)
            }
         </div>
      </section>
      <section className="itemDetails-text-container responsive-margin relative">
         <h1 className="itemDetails-h1">{ data?.item.name }<p className="itemDetails-price absolute">{ data?.item.price }$</p></h1>
         <div>
            <p>Select color:</p>
            <div className="flex itemDetails-color-container">
               {
                  Object.keys(colorSize.current)?.map(color =>
                     <div
                        key={color}
                        className={`itemDetails-color-border ${selectedColor === color ? "selected" : ""}`}
                     >
                        <div
                           onClick={handleColorClick}
                           style={{ backgroundColor: color }}
                           className="itemDetails-color"
                        ></div>
                     </div>
                  )
               }
            </div>
         </div>
         <div>
            <p>Select size:</p>
            <div className="flex itemDetails-color-container">
               {
                  colorSize.current[selectedColor]?.map((size, i) => 
                     <FilterBtn
                        key={i}
                        text={size}
                        array={selectedSizes}
                        setArray={setSelectedSizes}
                     />
                  )
               }
            </div>
         </div>
         <div className="itemDetails-number-container">
            <label htmlFor="itemCount">
               How many would you like:
               <input
                  type="number"
                  name="itemCount"
                  disabled={selectedSizes.length < 1}  // TODO: disable indecation to user
                  value={selectedCount}
                  onChange={e => setSelectedCount(e.target.value)}
                  className="itemDetails-number-input"
               />
            </label>
            <div className="itemDetails-addToCart-btn">
               <Button
                  text={"Add to cart"}
                  fn={handleAddToCart}
                  disabled={isCountError}
               />
            </div>
         </div>
      </section>
      <section className="responsive-margin">
         <h2>More { data?.item.section } { data?.item.type }</h2>
         <div>
            <Items
               endpoint={`/items/list?section=${data?.item.section}&type=${data?.item.type}&page=`}
               queryId={[data?.item.section, data?.item.type]}
               rootRef={{current: null}}
            />
         </div>
      </section>
   </div>;
}

export default ItemDetails;