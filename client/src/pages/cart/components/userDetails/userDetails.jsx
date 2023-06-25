import { forwardRef, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";

import Button from "../../../../components/button/button";
import Loading from "../../../../components/loading/loading";

import fetchFn from "../../../../utils/fetchFn";
import { dialogContext } from "../../../../context/dialogContext";

import "./userDetails.css";

// eslint-disable-next-line react/display-name
const UserDetails = forwardRef(({ setCartItems }, ref) => {

   const showDialog = useContext(dialogContext);
   const [isChecked, setIschecked] = useState(false);
   const [inputData, setInputData] = useState({
      phone_number: "",
      country: "",
      city: "",
      district: "",
      nearestPoI: "",
   });

   function handleInputChange(e) {
      setInputData(p => ({ ...p, [e.target.name]: e.target.value }));
   }

   const { isLoading, error } = useQuery(
      ["userInfo"],
      () => fetchFn("/user/info/get", "GET", localStorage.getItem("ssID")),
      {
         onSuccess: (data) => {
            Object.keys(data.dataValues).forEach(d => {
               setInputData(p => ({ ...p, [d]: data.dataValues[d] ? data.dataValues[d] : "" }));
            });
         }
      });
   
   const { isLoading: isMutLoading, error: MutError, mutate } = useMutation({
      mutationFn: ({ route, body }) => fetchFn(route, "POST", localStorage.getItem("ssID"), body),
   });

   function handleCheckBtn() {
      mutate({ route: "/user/info/set", body: inputData }, {
         onSuccess: () => setIschecked(true),
      });
   }

   function handleCashOrder() {
      mutate({
         route: "/order/make",
         body: {
            payment_method: "cash",
            credit_card: null,
         }
      }, {
         onSuccess: (data) => {
            setCartItems([]);
            localStorage.removeItem("cartItems");
            localStorage.setItem("ssID", data.sessionToken);
            ref.current.close();
            showDialog("Order made. You can see your order in your profile page.")
         }
      });
   }

   return <dialog ref={ref} className="userDetails editDialog-container">
      {
         isLoading ? <Loading /> 
         : error ? <p>{ error.message }</p>
         : <>
            <h3>Enter your information</h3>
            <div className="userDetails-fields-container grid">
               <label htmlFor="phone_number">Phone number: </label>
               <input
                  type="text"
                  name="phone_number"
                  value={inputData.phone_number}
                  onChange={handleInputChange}
               />
               <label htmlFor="country">Country: </label>
               <input
                  type="text"
                  name="country"
                  value={inputData.country}
                  onChange={handleInputChange}
               />
               <label htmlFor="city">City: </label>
               <input
                  type="text"
                  name="city"
                  value={inputData.city}
                  onChange={handleInputChange}
               />
               <label htmlFor="district">District: </label>
               <input
                  type="text"
                  name="district"
                  value={inputData.district}
                  onChange={handleInputChange}
               />
               <label htmlFor="nearestPoI">Nearest point of intrest: </label>
               <input
                  type="text"
                  name="nearestPoI"
                  value={inputData.nearestPoI}
                  onChange={handleInputChange}
               />
            </div>
            <Button
               text={"check info"}
               fn={handleCheckBtn}
            />
         </>
      }
      {
         isChecked && <div className="userDetails-choose-container">
            <h3 className="userDetails-choose-header">Choose payment method</h3>
            <center>
               <Button
                  text={"order by cash"}
                  fn={handleCashOrder}
                  disabled={isMutLoading}
               />
               <Button
                  text={"order by credit-card"}
                  disabled={true}
                  />
            </center>
         </div>
      }
      {
         isMutLoading ? <Loading /> 
         : MutError ? <p>{MutError.message}</p>
         : ""
      }
      <div className="editDialog-actions-container flex">
         <Button
            text={"Cancel"}
            fn={() => ref.current.close()}
         />
      </div>
   </dialog>;
});

export default UserDetails;