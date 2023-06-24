import Button from "../../../../components/button/button";

import "./userDetails.css";

function UserDetails() {
   return <dialog>
      <h3>Enter your information</h3>
      <div>
         <label htmlFor="name">Name: </label>
         <input type="text" name="name" />
         <label htmlFor="phone_number">Phone number: </label>
         <input type="text" name="phone_number" />
         <label htmlFor="country">Country: </label>
         <input type="text" name="country" />
         <label htmlFor="city">City: </label>
         <input type="text" name="city" />
         <label htmlFor="district">District: </label>
         <input type="text" name="district" />
         <label htmlFor="nearestPoI">Nearest point of intrest: </label>
         <input type="text" name="nearestPoI" />
      </div>
      <Button text={"check info"} />
      <div>
         <h3>Choose payment method</h3>
         <Button text={"order by cash"} />
         <Button text={"order by credit-card"} />
      </div>
   </dialog>;
}

export default UserDetails;