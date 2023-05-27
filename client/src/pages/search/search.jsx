import { useState } from "react";
import "./search.css";
import Items from "../../components/items/items";

function Search() {

   const [searchTerm, setSearchTerm] = useState("");

   function handleFocus() {
      const DEVICEWIDTH = document.documentElement.clientWidth;
      document.querySelector(".search-background").style.opacity = 0;
      document.querySelector(".search-img-container").style.top = DEVICEWIDTH >= 550 ? "8vh" : "3vh";
      document.querySelector(".search-img-container").style.padding = "15px";
      document.querySelector(".search-input-container").style.top = DEVICEWIDTH >= 550 ? "25vh" : "17vh";
   }

   return <div className="search-container">
      <img src="images/home/black.png" alt="search background" className="search-background img transition-05"/>
      <div className="search-img-container transition-05">
         <img src="/icons/asr-logo.svg" alt="ASR Logo" className="img"/>
      </div>
      <div className="search-input-container transition-05">
         <input
            type="search"
            placeholder="search..."
            className="search-input"
            onKeyDown={e => {
               if (e.key === "Enter")
                  setSearchTerm(e.target.value);
            }}
            onFocus={handleFocus}
         />
      </div>
      <section className="search-items-container">
         {searchTerm && <Items
            endpoint={`/items/search?term=${searchTerm}&page=`}
            queryId={searchTerm}
            rootRef={{current: null}}
         />}
      </section>
   </div>;
}

export default Search;