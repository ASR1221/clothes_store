import { useMemo, useRef } from "react";
import Items from "../../components/items/items";
import { useParams } from "react-router-dom";

function Trends() {

   const containerRef = useRef();
   const { section } = useParams();
   const type = useMemo(() => {
      if (section === "women") return "dresses";
      if (section === "men") return "coats";
      if (section === "kids") return "shirts";
   }, [section]);

   return <div className="cart-container">
      <div className="cart logo-container">
         <img className="img" src="/icons/asr-logo.svg" alt="ASR Logo" />
      </div>
      <h1 className="cart-h1">Trends</h1>
      <div ref={containerRef}>
         <Items
            endpoint={`/items/list?section=${section}&type=${type}&page=`}
            queryId={`${section}_trends`}
            rootRef={containerRef}
         />
      </div>
   </div>;
}

export default Trends;