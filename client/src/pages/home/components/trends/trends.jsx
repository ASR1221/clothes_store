/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Link } from "react-router-dom";

import "./trends.css";

function Trends({ imgsLoad, handleImgsLoad, trendImgs, trendText, section }) {
   

   const type = useMemo(() => {
      if (section === "women") return "dresses";
      if (section === "men") return "coats";
      if (section === "kids") return "shirts";
   }, [section]);

   return (
      <>
         <h2>Trends</h2>
         <Link to={`/trends/${section}?type=${type}`} className="home-main-trend cat grid">
            <div className="trends-placeholder">
               <img
                  onLoad={() =>
                     handleImgsLoad({ ...imgsLoad.current, cat: true })
                  }
                  src={trendImgs.cat}
                  alt="trend category"
                  className="img transition-1"
               />
            </div>
            <p>{trendText}</p>
         </Link>
         <div className="home-main-trend items grid">
            <Link to="/item/5">
               <div className="trends-placeholder">
                  <img
                     onLoad={() =>
                        handleImgsLoad({
                           ...imgsLoad.current,
                           item1: true,
                        })
                     }
                     src={"/images/" + trendImgs.item1}
                     alt="trend item"
                     className="img home-main-trend-img"
                     crossOrigin="anonymous"
                  />
               </div>
            </Link>
            <Link to="/item/6">
               <div className="trends-placeholder">
                  <img
                     onLoad={() =>
                        handleImgsLoad({
                           ...imgsLoad.current,
                           item2: true,
                        })
                     }
                     src={"/images/" + trendImgs.item2}
                     alt="trend item"
                     className="img home-main-trend-img"
                     crossOrigin="anonymous"
                  />
               </div>
            </Link>
            <Link to="/item/13">
               <div className="trends-placeholder">
                  <img
                     onLoad={() =>
                        handleImgsLoad({
                           ...imgsLoad.current,
                           item3: true,
                        })
                     }
                     src={"/images/" + trendImgs.item3}
                     alt="trend item"
                     className="img home-main-trend-img"
                     crossOrigin="anonymous"
                  />
               </div>
            </Link>
         </div>
      </>
   );
}

export default Trends;
