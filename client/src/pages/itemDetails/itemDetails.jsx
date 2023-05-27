import "./itemDetails.css";

import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState, useRef } from "react";

import fetchFn from "../../utils/fetchFn";

import Items from "../../components/items/items";
import FilterBtn from "../../components/filterBtn/filterBtn";
import Button from "../../components/button/button";

// TODO: loading state and error state 
// TODO: responive layout
// TODO: add functionality

function ItemDetails() {

   const { id } = useParams();

   const {
      isLoading,
      isFetching,
      isSuccess,
      error,
      data,
   } = useQuery(["item", id], () => fetchFn(`/items/details/${id}`, "GET"));

   const [selectedImg, setSelectedImg] = useState("");
   const colorSize = useRef({});
   const [selectedColor, setSelectedColor] = useState("");
   const [selectedSizes, setSelectedSizes] = useState([]);

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
      <section className="grid itemDetails-imgs-container">
         <div className="itemDetails-mainImg-container">
            <img className="img" src={selectedImg} alt="selected item image" />
         </div>
         <div className="grid itemDetails-smallImgs-container">
            {
               data?.images.map((img, i) =>
                  <div key={i} className={`itemDetails-smallImg-container ${selectedImg === img ? "selected" : ""}`}>
                  <img className="img" src={img} alt="item image" />
               </div>)
            }
         </div>
      </section>
      <section className="itemDetails-text-container">
         <h1>{ data?.item.name }<p className="itemDetails-price">{ data?.item.price }$</p></h1>
         <div>
            <p>Select color:</p>
            <div className="flex itemDetails-color-container">
               {
                  Object.keys(colorSize.current)?.map(color =>
                     <div key={color} className={`itemDetails-color-border ${selectedColor === color ? "selected" : ""}`}>
                        <div
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
         <div>
            <label htmlFor="itemCount">
               How many would you like:
               <input type="number" name="itemCount" className="itemDetails-number-input"/>
            </label>
            <Button
               text={"Add to cart"}
            />
         </div>
      </section>
      <section>
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