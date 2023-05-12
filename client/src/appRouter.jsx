import { Route, Routes } from "react-router-dom";
import Signin from "./signin";
import Upload from "./upload";
import NavBar from "./components/NavBar";
import Home from "./pages/home/home";

function App() {

   return <Routes path="/" element={<NavBar />}>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login/complete" element={<Signin />} />
      <Route path="/upload" element={<Upload />} />
   </Routes>
}

export default App;