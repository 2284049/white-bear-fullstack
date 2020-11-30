import React from "react";
import landingLogo from "../../img/logo-landing.png";
import SignUp from "../ui/SignUp";
import LogIn from "../ui/LogIn";

export default function Landing() {
   return (
      <>
         <div className="background-image">
            <div className="container">
               <div className="row mb-8">
                  <div className="col-5 col-sm-4 col-xl-2 mt-6">
                     <img
                        src={landingLogo}
                        className="float-right"
                        alt="White Bear Logo"
                     />
                  </div>
                  <div className="col-7 col-sm-8 col-xl-10 mt-6">
                     <h1 className="d-inline text-brand text-light">
                        White Bear
                     </h1>
                  </div>
               </div>
               <div className="row justify-content-center">
                  <SignUp />
                  <LogIn />
               </div>
            </div>
         </div>
      </>
   );
}
