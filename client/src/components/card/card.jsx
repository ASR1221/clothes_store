import { Link } from "react-router-dom";
import "./card.css";

// eslint-disable-next-line react/prop-types
function ItemCard({ id, name, price, type, img }) {

	// fetch logic and click logic here

   return (
      <Link
         to={`/item/${id}`}
         state={{id, name, price, type}}
         className="card-container"
      >
         <div className="placeholder">
            <img
               src={ img }
               alt="item image"
               className="card-img transition-1 img"
            />
         </div>
         <div className="card-text">
            <p className="card-name">{ name }</p>
            <p className="card-price">{ price }$</p>
         </div>
      </Link>
   );
}

export default ItemCard;
