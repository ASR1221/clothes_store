import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import fetchFn from "../../utils/fetchFn";

import FilterBtn from "../../components/filterBtn/filterBtn";
import ItemCard from "../../components/card/card";

import "./home.css";

// TODO: infinteQuery and trends in server and client

function Home() {
   const [section, setSection] = useState("women");
   const [types, setTypes] = useState([]);
   const trendImgsRef = useRef({
      cat: "/images/home/elei-top.png",
      item1: "/images/1683055485589-Cotton shirt-1.jpg",
      item2: "/images/1683055559620-Oxford shirt-1.jpg",
      item3: "/images/1683056627574-Waxed tie-belt coat-1.jpg",
   });

   function updateType(newType) {
      // needs to be passes to FilterBtn
      if (types.includes(newType)) {
         setTypes((p) => p.filter((type) => type !== newType));
      } else {
         setTypes((p) => [...p, newType]);
      }
   }

   const TYPES = ["jeans", "shirts", "coats", "dresses", "skirts"];
   const {
      isLoading,
      isFetching,
      refetch,
      isError,
      error,
      data: items,
   } = useQuery(["items", section], () =>
      fetchFn(`/items/list?section=${section}`, "GET")
   );

   useEffect(() => {
      refetch();

      if (section === "women") {
         trendImgsRef.current = {
            cat: "/images/home/elei-top.png",
            item1: "/images/1683055485589-Cotton shirt-1.jpg",
            item2: "/images/1683055559620-Oxford shirt-1.jpg",
            item3: "/images/1683056627574-Waxed tie-belt coat-1.jpg",
         };
      } else if (section === "men") {
         trendImgsRef.current = {
            cat: "/images/home/black.png",
            item1: "/images/1683057393396-Regular Fit Oxford shirt-1.jpg",
            item2: "/images/1683057632516-Felted wool-blend car coat-1.jpg",
            item3: "/images/1683057591829-Slim Jeans-1.jpg",
         };
      } else if (section === "kids") {
         trendImgsRef.current = {
            cat: "/images/home/kids-in-suit.png",
            item1: "/images/1683056826778-Pleated tulle dress-1.jpg",
            item2: "/images/1683057044567-Printed sweatshirt-2.jpg",
            item3: "/images/1683057143507-Superstretch Slim Fit Jeans-1.jpg",
         };
      }

      mainSlideRef.current.style.top = "91%";
      navigatorRef.current.parentElement.style.top = "87%";
   }, [section]);

   //! #######  Main Slide Animation  ########

   const mainSlideRef = useRef();
   const [mouseIsDown, setMouseIsDown] = useState(false);
   const touchYRef = useRef({});
   const previousPosRef = useRef();

   useEffect(() => {
      previousPosRef.current = parseInt(window.getComputedStyle(mainSlideRef.current).top, 10);
      if (document.documentElement.clientWidth < 550) {
         document.body.style.overflow = "hidden";
         document.body.style.overscrollBehaviorY = "contain";
      }

      return () => {
         document.body.style.overflow = "scroll";
         document.body.style.overscrollBehaviorY = "auto";
      };
   }, []);

   function handleMainSlideDown(e, isIndecator) {
      if (document.documentElement.clientWidth >= 550) {
         return;
      }

      touchYRef.current.first = e.touches[0].clientY;
      if (
         mainSlideRef.current.scrollTop < 2 ||
         (isIndecator &&
            parseInt(window.getComputedStyle(mainSlideRef.current).top, 10) === 0)
      ) {
         setMouseIsDown(true);
      }
   }

   useEffect(() => {
      function handleMainSlideUp() {
         if (!mouseIsDown) {
            return;
         }

         const offset =
            previousPosRef.current - parseInt(touchYRef.current.last);

         if (offset > 0) {
            mainSlideRef.current.style.top = "0";
            mainSlideRef.current.style.borderRadius = "0";
            mainSlideRef.current.style.overflow = "scroll";
            mainSlideRef.current.scrollTop = 0;
         } else {
            navigatorRef.current.parentElement.style.top = "79%";
            mainSlideRef.current.style.top = "83%";
            mainSlideRef.current.style.borderRadius = "18px";
            mainSlideRef.current.style.overflow = "hidden";
            setTimeout(() => (mainSlideRef.current.scrollTop = 0), 500);
         }

         setTimeout(
            () =>
               (previousPosRef.current = parseInt(window.getComputedStyle(mainSlideRef.current).top, 10)),
            1000);
         setMouseIsDown(false);
      }

      function handleMainSlideMove(e) {
         if (mouseIsDown) {
            if (
               parseInt(window.getComputedStyle(mainSlideRef.current).top, 10) === 0 &&
               e.touches[0].clientY < touchYRef.current.first
            ) {
               setMouseIsDown(false);
               return;
            }

            if (
               e.touches[0].clientY >= 0 &&
               e.touches[0].clientY < document.documentElement.clientHeight * 0.84
            ) {
               mainSlideRef.current.style.top = e.touches[0].clientY + "px";
               touchYRef.current.last = e.touches[0].clientY;
            }
         }
      }

      document.body.addEventListener("touchmove", handleMainSlideMove, { passive: false });
      document.body.addEventListener("touchend", handleMainSlideUp, { passive: false });

      return () => {
         document.body.removeEventListener("touchmove", handleMainSlideMove);
         document.body.removeEventListener("touchend", handleMainSlideUp);
      };
   }, [mouseIsDown]);

   //! #######  Main Slide Animation End  ########

   //! #######  Carousel Animation   ########

   const carouselRef = useRef();
   const navigatorRef = useRef();
   const isAllowedRef = useRef(true);
   const imgsLoad = useRef({
      cat: false,
      item1: false,
      item2: false,
      item3: false,
   });

   function handleImgsLoad(obj) {
      isAllowedRef.current = false;
      imgsLoad.current = obj;
      if (
         imgsLoad.current.cat &&
         imgsLoad.current.item1 &&
         imgsLoad.current.item2 &&
         imgsLoad.current.item3
      ) {
         mainSlideRef.current.style.top = "83%";
         navigatorRef.current.parentElement.style.top = "79%";
         setTimeout(() => (isAllowedRef.current = true), 500);
      }
   }

   function scrollLeft() {
      carouselRef.current.scrollLeft -= document.documentElement.clientWidth;
   }

   function scrollRight() {
      carouselRef.current.scrollLeft += document.documentElement.clientWidth;
   }

   function handleCarouselScroll() {
      const screenWidth = document.documentElement.clientWidth;
      const scrollPrecentage =
         carouselRef.current.scrollLeft / (3 * screenWidth);

      navigatorRef.current.style.transform = `translateX(${
         scrollPrecentage * 300
      }%)`;

      let isChanged = false;
      if (
         Math.round(carouselRef.current.scrollLeft) >= 0 &&
         Math.round(carouselRef.current.scrollLeft) < 2
      ) {
         setSection("women");
         isChanged = true;
      } else if (
         Math.round(carouselRef.current.scrollLeft) >= screenWidth - 2 &&
         Math.round(carouselRef.current.scrollLeft) < screenWidth + 2
      ) {
         setSection("men");
         isChanged = true;
      } else if (
         Math.round(carouselRef.current.scrollLeft) >= 2 * screenWidth - 2 &&
         Math.round(carouselRef.current.scrollLeft) < 2 * screenWidth + 2
      ) {
         setSection("kids");
         isChanged = true;
      }

      if (isChanged && isAllowedRef.current) {
         imgsLoad.current = {
            cat: false,
            item1: false,
            item2: false,
            item3: false,
         };
      }
   }

   //! #######  Carousel Animation End  ########

   return (
      <div className="home">
         <button type="button" onClick={scrollLeft} className="leftScrollBtn">
            <img
               src="/icons/carousel-arrow.png"
               alt="left scroll"
               className="scrollBtnImg"
            />
         </button>
         <button type="button" onClick={scrollRight} className="rightScrollBtn">
            <img
               src="/icons/carousel-arrow.png"
               alt="right scroll"
               className="scrollBtnImg"
            />
         </button>
         <section
            onScroll={handleCarouselScroll}
            className="home-carousel grid transition-05"
            ref={carouselRef}
         >
            <div className="home-carousel-placeholder">
               <Link to="/trends/women">
                  <img
                     src="/images/home/elei-top.png"
                     alt="Home image"
                     className="img home-carousel-img women"
                  />
                  </Link>
            </div>
            <div className="home-carousel-placeholder">
               <Link to="/trends/men">
                  <img
                     src="/images/home/man-in-suit.png"
                     alt="Home image"
                     className="img home-carousel-img men"
                  />
               </Link>
            </div>
            <div className="home-carousel-placeholder">
               <Link to="/trends/kids">
                  <img
                     src="/images/home/kids-in-coats.png"
                     alt="Home image"
                     className="img home-carousel-img kids"
                  />
               </Link>
            </div>
         </section>
         <div className="home-carousel-navigator transition-05">
            <div ref={navigatorRef}></div>
         </div>
         <section
            onTouchStart={(e) => handleMainSlideDown(e, false)}
            className="home-main transition-05"
            ref={mainSlideRef}
         >
            <div
               onTouchStart={(e) => handleMainSlideDown(e, true)}
               className="home-main-slideIndecator-div transition-05"
            >
               <p className="home-main-slideIndecator-p"></p>
            </div>
            <div>
               <h2>Trends</h2>
               <Link to="/trends/category" className="home-main-trend cat grid">
                  <div className="trends-placeholder">
                     <img
                        onLoad={() =>
                           handleImgsLoad({ ...imgsLoad.current, cat: true })
                        }
                        src={trendImgsRef.current.cat}
                        alt="trend category"
                        className="img transition-1"
                     />
                  </div>
                  <p>
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                     sed do eiusmod tempor incididunt ut labore et dolore magna
                     aliqua
                  </p>
               </Link>
               <div className="home-main-trend items grid">
                  <Link to="/item/5">
                     <div className="trends-placeholder">
                        <img
                           onLoad={() =>
                              handleImgsLoad({
                                 ...imgsLoad.current,
                                 item1: true,
                              })
                           }
                           src={trendImgsRef.current.item1}
                           alt="trend item"
                           className="img home-main-trend-img"
                        />
                     </div>
                  </Link>
                  <Link to="/item/6">
                     <div className="trends-placeholder">
                        <img
                           onLoad={() =>
                              handleImgsLoad({
                                 ...imgsLoad.current,
                                 item2: true,
                              })
                           }
                           src={trendImgsRef.current.item2}
                           alt="trend item"
                           className="img home-main-trend-img"
                        />
                     </div>
                  </Link>
                  <Link to="/item/13">
                     <div className="trends-placeholder">
                        <img
                           onLoad={() =>
                              handleImgsLoad({
                                 ...imgsLoad.current,
                                 item3: true,
                              })
                           }
                           src={trendImgsRef.current.item3}
                           alt="trend item"
                           className="img home-main-trend-img"
                        />
                     </div>
                  </Link>
               </div>
               <h2>All</h2>
               <div className="flex home-main-types">
                  {TYPES.map((type) => {
                     if (section === "men" && (type === "skirts" || type === "dresses"))
                        return;
                     
                     return (
                        <FilterBtn
                           text={type}
                           updateState={updateType}
                           key={type}
                        />
                     );
                  })}
               </div>
               <div className="grid home-main-items">
                  {isError
                     ? "Sorry, some error happend."
                     : isLoading
                     ? "Loading"
                     : items.map((item) => {
                          if (types.length > 0 && !types.includes(item.type))
                             return;
                          return (
                             <ItemCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                img={item.image_path}
                                type={item.type}
                             />
                          );
                       })}
               </div>
            </div>
         </section>
      </div>
   );
}

export default Home;
