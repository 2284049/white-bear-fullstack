import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import saveIcon from "../../icons/save.svg";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";

export default class CreateImagery extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         imageryText: "",
      };
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value }); // set the state of imageryText to be whatever the user inputs in that field (e.target.value)
      console.log(e.target.value);
   }

   checkHasInvalidCharCount() {
      if (
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else return false;
   }

   render() {
      return (
         <AppTemplate>
            <p className="text-center lead text-muted my-2">
               Add memorable imagery
            </p>

            <div className="card">
               <div className="card-body bg-primary lead">
                  {/* <!-- We put in two different text areas 
                     for the mockup depending on screen size, 
                     so that 300 characters would show without 
                     having scroll bars. d-md-none and d-md-block-->
              <!-- Autofocus is an attribute so the cursor is
                 automatically blinking when the page loads. --> */}
                  {/* <!-- Commenting the first textarea out, to focus on character counts */}

                  <textarea
                     rows="6"
                     id="create-imagery-input"
                     autoFocus={true}
                     defaultValue=""
                     onChange={(e) => this.setImageryText(e)} // whatever the user changes to the card, it fires to update the state
                  ></textarea>
               </div>
            </div>
            <div className="card">
               <div className="card-body bg-secondary lead">
                  One morning, when Gregor Samsa woke from troubled dreams, he
                  found himself transformed in his bed into a horrible vermin.
                  He lay on his armour-like back, and if he lifted his head a
                  little he could se
               </div>
            </div>

            <p
               className="float-right mt-2 mb-5 text-muted"
               id="imagery-characters"
            >
               <span
                  id="imagery-char-count"
                  className={classnames({
                     "text-danger": checkIsOver(
                        this.state.imageryText,
                        MAX_CARD_CHARS
                     ),
                  })}
               >
                  {this.state.imageryText.length}/{MAX_CARD_CHARS}
               </span>
            </p>

            <div className="clearfix"></div>

            <Link
               to="/create-answer"
               className="btn btn-link mt-1"
               id="back-to-answer"
            >
               Back to answer
            </Link>
            <Link
               to="/create-answer"
               className={classnames(
                  "btn btn-primary btn-lg ml-4 float-right",
                  {
                     disabled: this.checkHasInvalidCharCount(),
                  }
               )}
               id="save-card"
            >
               <img
                  src={saveIcon}
                  width="20px"
                  alt=""
                  style={{
                     marginBottom: "3px",
                     marginRight: "5px",
                     marginLeft: "-1px",
                  }}
               />
               Save
            </Link>
         </AppTemplate>
      );
   }
}
