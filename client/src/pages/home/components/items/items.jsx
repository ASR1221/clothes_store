/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";

import FilterBtn from "../../../../components/filterBtn/filterBtn";
import ItemCard from "../../../../components/card/card";
import fetchFn from "../../../../utils/fetchFn";

import "./items.css"

function Items({section, mainSlideRef}) {

   // constants
   const DEVICEWIDTH = document.documentElement.clientWidth;
   const TYPES = ["jeans", "shirts", "coats", "dresses", "skirts"];

   // types to filter items
   const [types, setTypes] = useState([]);
   
   //! ############# Items Query ###############
   function InfinitFetch({ pageParam = 1 }) {
      return fetchFn(`/items/list?section=${section}&page=${pageParam}`, "GET")
   }

   const {
      data: items,
      error,
      fetchNextPage,
      hasNextPage,
      isLoading,
      isFetchingNextPage,
      isSuccess,
      // refetch,
   } = useInfiniteQuery(["items", section], InfinitFetch, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });
   //! ############# Items Query End ###############


   //! ###########  Infinte Scroll Observer ##############
   const containerRef = useRef(null);
   const observerRef = useRef(null);
   useEffect(() => {
      observerRef.current = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
               fetchNextPage();
            }
         },
         { root: mainSlideRef.current, threshold: 0.1, rootMargin: "650px" }
      );

      if (containerRef.current) {
         observerRef.current.observe(containerRef.current);
      }

      return () => {
         if (containerRef.current) {
            observerRef.current.unobserve(containerRef.current);
         }
      };
   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
   //! ###########  Infinte Scroll Observer End ##############

   return (
      <>
         <h2>All</h2>
         <div className="flex home-main-types">
            {TYPES.map((type) => {
               if (
                  section === "men" &&
                  (type === "skirts" || type === "dresses")
               )
                  return;

               return (
                  <FilterBtn
                     text={type}
                     array={types}
                     setArray={setTypes}
                     key={type}
                  />
               );
            })}
         </div>
         <div className="grid home-main-items">
            {isLoading
               ? "Loading..."
               : error
               ? error.message
               : isSuccess
               ? items.pages.map((page) =>
                    page.items.map((item, i) => {
                       if (types.length > 0 && !types.includes(item.type))
                          return;

                       return (
                          <>
                             <ItemCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                img={item.image_path}
                                type={item.type}
                             />
                             {i === page.items.length - 1 && (
                                <>
                                   <div ref={containerRef}></div>
                                   <div></div>
                                   {DEVICEWIDTH >= 450 && <div></div>}
                                </>
                             )}
                          </>
                       );
                    })
                 )
               : "No Items"}
         </div>
      </>
   );
}

export default Items;
