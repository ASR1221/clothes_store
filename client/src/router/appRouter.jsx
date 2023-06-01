import { Route, Routes } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import fetchFn from "../utils/fetchFn";
import { dialogContext } from "../context/dialogContext.js";

import NavBar from "../components/navBar/navBar";
import Home from "../pages/home/home";
import Search from "../pages/search/search";
import ItemDetails from "../pages/itemDetails/itemDetails";
import Dialog from "../components/dialog/dialog";

function App() {

   const [dialogTxt, setDialogTxt] = useState();
   const dialogRef = useRef();

   function showDialog(text) {
      setDialogTxt(text);
      dialogRef.current.style.display = "block";
      setTimeout(() => dialogRef.current.style.bottom = "57px", 10);
      setTimeout(() => {
         dialogRef.current.style.bottom = "-120px";
         setTimeout(() => dialogRef.current.style.display = "none", 700);
      }, 3500);
   }

   useEffect(() => {
      if (localStorage.getItem("user")) {
         fetchFn("/user/info/get", "GET")
            .then(res => localStorage.setItem("user", res))
            .catch(() => localStorage.removeItem("user"));
      }
   }, []);

   return <>
      <dialogContext.Provider value={showDialog} >
         <Routes>
            <Route
               path="/"
               element={<>
                  <NavBar />
                  <Dialog text={dialogTxt} ref={dialogRef}/>
               </>}>
               <Route index element={<Home />} />
               <Route path="search" element={<Search />} />
               <Route path="item/:id" element={<ItemDetails />} />
            </Route>
         </Routes>
      </dialogContext.Provider>

   </>
}

export default App;