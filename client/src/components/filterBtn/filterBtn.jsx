/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./filterBtn.css"

function FilterBtn({ text, array, setArray }) {

   const [isSelected, setIsSelected] = useState(false);

   useEffect(() => {
      if (!array.length) setIsSelected(false);
   }, [array]);
   
   function handleClick() {
      setIsSelected(!isSelected);
      if (array.includes(text)) {
         setArray((p) => p.filter((a) => a !== text));
      } else {
         setArray((p) => [...p, text]);
      }
   }

   return (  
      <button
         onClick={handleClick}
         className="filterBtn"
         style={{
            backgroundColor: isSelected ? "black" : "white",
            color: isSelected ? "white" : "black"
         }}
      >
         {text}
      </button>
   );
}

export default FilterBtn;