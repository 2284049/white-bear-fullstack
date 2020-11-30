import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
   const url = window.location.pathname;
   const tabActiveOnCreate = (url) => {
      if (
         url.indexOf("create-answer") > 0 ||
         url.indexOf("create-imagery") > 0
      ) {
         // if the indexOf is greater than 0, that means it was found in the URL
         return "tab-active";
      } else return "";
   };
   const tabActiveOnReview = (url) => {
      if (
         url.indexOf("review-answer") > 0 ||
         url.indexOf("review-imagery") > 0 ||
         url.indexOf("review-empty") > 0
      ) {
         // if the indexOf is greater than 0, that means it was found in the URL
         return "tab-active";
      } else return "";
   };
   const tabActiveAllCards = (url) => {
      if (url.indexOf("all-cards") > 0 || url.indexOf("edit") > 0) {
         // if the indexOf is greater than 0, that means it was found in the URL
         return "tab-active";
      } else return "";
   };

   return (
      <div
         className="btn-group d-flex mt-1 mb-5"
         role="navigation"
         aria-label="navigation"
      >
         <Link
            to="/create-answer"
            className={`btn btn-secondary ${tabActiveOnCreate(url)}`}
         >
            Create new
         </Link>
         <Link
            to="/review-imagery"
            className={`btn btn-secondary tab-separator ${tabActiveOnReview(
               url
            )}`}
         >
            Review
         </Link>
         <Link
            to="/all-cards"
            className={`btn btn-secondary tab-separator ${tabActiveAllCards(
               url
            )}`}
         >
            All cards
         </Link>
      </div>
   );
}
