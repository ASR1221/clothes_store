import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import fetchFn from "../utils/fetchFn";

import NavBar from "../components/navBar/navBar";
import Home from "../pages/home/home";
import Search from "../pages/search/search";
import ItemDetails from "../pages/itemDetails/itemDetails";

function App() {

   useEffect(() => {
      if (localStorage.getItem("user")) {
         fetchFn("/user/info/get", "GET")
            .then(res => localStorage.setItem("user", res))
            .catch(() => localStorage.removeItem("user"));
      }
   }, []);

   return <Routes>
      <Route path="/" element={<NavBar />}>
         <Route index element={<Home />} />
         <Route path="search" element={<Search />} />
         <Route path="item/:id" element={<ItemDetails />} />
      </Route>
   </Routes>
}

export default App;