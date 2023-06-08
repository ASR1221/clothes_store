import { Route, Routes } from "react-router-dom";
import { useState, useRef } from "react";

// import fetchFn from "../utils/fetchFn";
import { dialogContext } from "../context/dialogContext.js";

import NavBar from "../components/navBar/navBar";
import Home from "../pages/home/home";
import Search from "../pages/search/search";
import ItemDetails from "../pages/itemDetails/itemDetails";
import Dialog from "../components/dialog/dialog";
import Login from "../pages/login/login";

// TODO: fix dialog
// TODO: mutation and loading states in itemDetails
// TODO: error states in login

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

   // const [checked, setChecked] = useState(false);

   // useEffect(() => {
   //    const ssID = localStorage.getItem("ssID");
   //    if (ssID && !checked) {
   //       fetchFn("/user/info/get", "GET", ssID)
   //          .then(res => localStorage.setItem("user", res))
   //          .catch(() => localStorage.removeItem("user"));
         
   //       setChecked(true);
   //    }
   // }, []);

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
               <Route path="login" element={<Login />}></Route> {/* This should be the redirect url for logins */}
            </Route>
         </Routes>
      </dialogContext.Provider>

   </>
}

export default App;