import "./itemDetails.css";

import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useEffect, useState, useRef, useContext, useMemo } from "react";

import fetchFn from "../../utils/fetchFn";
import { dialogContext } from "../../context/dialogContext.js";

import Items from "../../components/items/items";
import FilterBtn from "../../components/filterBtn/filterBtn";
import Button from "../../components/button/button";
import Loading from "../../components/loading/loading";

function ItemDetails() {

   const { id } = useParams();

   const { mutate } = useMutation({
      mutationFn: ({ body }) => fetchFn("/cart/add", "POST", localStorage.getItem("ssID"), body),
      onSuccess: data => {
         localStorage.setItem("ssID", data.sessionToken);
      },
      onError: (e) => showDialog(e.message),
   });

   const {
      isLoading,
      data,
   } = useQuery(["item", id], () => fetchFn(`/items/details/${id}`, "GET"), {
      onError: (e) => showDialog(e.message),
   });

   const colorSize = useRef({});
   const [selectedImg, setSelectedImg] = useState("");
   const [selectedColor, setSelectedColor] = useState("");
   const [selectedSizes, setSelectedSizes] = useState([]);
   const [selectedCount, setSelectedCount] = useState(1);

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

      const cartItems = data?.itemDetails.flatMap((detail) => {
         if ((detail.color === selectedColor)) {
            if (selectedSizes.includes(detail.size)) {
               detail.stock -= selectedCount;
               return {
                  item_details_id: detail.id,
                  item_count: selectedCount,
               };
            }
         }
         return [];
      });

      if (localStorage.getItem("ssID") && localStorage.getItem("user")) {
         mutate({body: cartItems});
      }

      const previous = JSON.parse(localStorage.getItem("cartItems"));
      if (previous) {
         cartItems.push(...previous);
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      showDialog("Cart Item Added");
   }
   

   const isCountError = useMemo(() => {

      let changed = 0;
      data?.itemDetails.forEach((detail) => {
         if ((detail.color === selectedColor)) {
            if (selectedSizes.includes(detail.size)) {
               if (selectedCount > detail.stock) {
                  changed = detail.stock;
               }
            }
         }
      });
      
      if (changed) showDialog(`Sorry, we only have ${changed} of one of your selected sizes`);
      return changed;

   }, [data, selectedCount, selectedColor, selectedSizes]);

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
      <div> 
         {isLoading ? <Loading /> :
            <>
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
                           disabled={!selectedCount || !selectedSizes.length || isCountError}
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
            </>
         }
      </div>
   </div>;
}

export default ItemDetails;