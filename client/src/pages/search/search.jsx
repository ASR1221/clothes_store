import { useState } from "react";
import "./search.css"
import Items from "../../components/items/items";

// TODO: better styling and responsive

function Search() {

   const [searchTerm, setSearchTerm] = useState("");
   // const itemsRef = useRef();

   return <div className="main-padding">
      <div className="search-img-container">
         <img src="/icons/asr-logo.svg" alt="ASR Logo" className="img"/>
      </div>
      <div className="grid search-input-container">
         <input
            type="search"
            placeholder="search..."
            className="search-input"
            onKeyDown={e => {
               if (e.key === "Enter") 
                  setSearchTerm(e.target.value)
            }}
         />
      </div>
      <section >
         {searchTerm && <Items
            endpoint={`/items/search?term=${searchTerm}&page=`}
            queryId={searchTerm}
            rootRef={{current: null}}
         />}
      </section>
   </div>;
}

export default Search;