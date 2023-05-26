import { Route, Routes } from "react-router-dom";

import NavBar from "../components/navBar/navBar";
import Home from "../pages/home/home";
import Search from "../pages/search/search";

// route to a trend page

function App() {
   return <Routes>
      <Route path="/" element={<NavBar />}>
         <Route index element={<Home />} />
         <Route path="search" element={ <Search />} />
      </Route>
   </Routes>
}

export default App;