import { Route, Routes } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import fetchFn from "../utils/fetchFn";
import { dialogContext } from "../context/dialogContext.js";

import NavBar from "../components/navBar/navBar";
import Home from "../pages/home/home";
import Search from "../pages/search/search";
import ItemDetails from "../pages/itemDetails/itemDetails";
import Dialog from "../components/dialog/dialog";
import Login from "../pages/login/login";
import User from "../pages/user/user";

// TODO: orders page
// TODO: cart page and modals
// TODO: admins pages

function App() {

   const [dialogTxt, setDialogTxt] = useState();
   const dialogRef = useRef();

   function showDialog(text) {
      setDialogTxt(text);
      dialogRef.current.show();
      setTimeout(() => {
         dialogRef.current.close();
      }, 3000);
   }

   const [checked, setChecked] = useState(false);

   useEffect(() => {
      const ssID = localStorage.getItem("ssID");
      if (ssID && !checked) {
         fetchFn("/user/info/get", "GET", ssID)
            .catch(() => {
               localStorage.removeItem("user");
               localStorage.removeItem("ssID");
               localStorage.removeItem("cardItems");
            });
         
         setChecked(true);
      }
   }, []);

   return <>
      <dialogContext.Provider value={showDialog} >
         <Routes>
            <Route
               path="/"
               element={<>
                  <NavBar />
                  <Dialog text={dialogTxt} ref={dialogRef} />
               </>}>
               <Route index element={<Home />} />
               <Route path="search" element={<Search />} />
               <Route path="item/:id" element={<ItemDetails />} />
               <Route path="login" element={<Login />} /> {/* This should be the redirect url for logins */}
               <Route path="user" element={<User />} />
            </Route>
         </Routes>
      </dialogContext.Provider>
   </>
}

export default App;