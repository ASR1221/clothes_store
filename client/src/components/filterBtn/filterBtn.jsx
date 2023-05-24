import { useState } from "react";
import "./filterBtn.css"

function FilterBtn({ text, updateState }) {

   const [isSelected, setIsSelected] = useState(false);

   function handleClick() {
      setIsSelected(!isSelected);
      updateState(text);
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