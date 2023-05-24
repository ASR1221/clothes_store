import { Link, Outlet } from "react-router-dom";

import "./navBar.css";

function NavBar() {

   function handleActiveClass(e) {
      const allLinks = e.target.parentElement.parentElement.children;
      console.log(allLinks)
      for (let i = 0; i < allLinks.length; i++) {
         allLinks[i].classList.remove("active");
      }
      e.target.parentElement.classList.add("active");
   }

   return <>
      <nav  className="grid navBar">
         <Link className="active" to="/">
            <img onClick={handleActiveClass}  className="img" src="/icons/icons8-clothes-100.png" alt="home icon" />
         </Link>
         <Link onClick={handleActiveClass} to="/search">
            <img className="img" src="/icons/icons8-search.svg" alt="search icon" />
         </Link>
         <Link onClick={handleActiveClass} to="/cart">
            <img className="img" src="/icons/icons8-shopping-cart-100.png" alt="cart icon" />
         </Link>
         <Link onClick={handleActiveClass} to="/user">
            <img className="img" src="/icons/icons8-order-100.png" alt="user icon" />
         </Link>
      </nav>
      <Outlet />
   </>;
}

export default NavBar;