import { forwardRef, useState } from "react";
import { useQuery } from "react-query";

import fetchFn from "../../../utils/fetchFn";

import CartItems from "../../../components/cartItem/cartItems";
import Loading from "../../../components/loading/loading";
import Button from "../../../components/button/button";

// eslint-disable-next-line react/display-name
const OrderItems = forwardRef(({ id }, ref) => {

   const [orderItems, setOrderItems] = useState([]);

   const { isLoading, error } = useQuery(
      ["order", id],
      () => fetchFn(`/order/details/${id}`, "GET", localStorage.getItem("ssID")),
      {
         onSuccess: (data) => {
            data.forEach(d => 
               setOrderItems(p => ([...p, {
                  id: d.id,
                  item_count: d.item_count,
                  itemDetailsId: d.itemsDetail.id,
                  size: d.itemsDetail.size,
                  color: d.itemsDetail.color,
                  name: d.itemsDetail.item.name,
                  price: d.itemsDetail.item.price,
                  itemId: d.itemsDetail.item.id,
                  img: d.itemsDetail.item.image_path,
               }]))
            )
         },
      }
   )

   return <dialog className="editDialog-container" ref={ref}>
      <div className="editDialog-details-container">
         <h2>Order Items</h2>
         {
            isLoading ? <Loading />
            : error ? <p>{error.message}</p>
            : orderItems && orderItems.length > 0 && <CartItems
               isEditable={false}
               cartItems={orderItems}
            />
         }
      </div>
      <div className="editDialog-actions-container flex">
         <Button
            text={"close"}
            fn={() => ref.current.close()}
         />
      </div>
   </dialog>;
});

export default OrderItems;