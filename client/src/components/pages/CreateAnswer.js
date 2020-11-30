import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";

export default class CreateAnswer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: "",
      };
   }

   setAnswerText(e) {
      this.setState({ answerText: e.target.value }); // set the state of imageryText to be whatever the user inputs in that field (e.target.value)
      console.log(e.target.value);
   }

   checkHasInvalidCharCount() {
      if (
         this.state.answerText.length > MAX_CARD_CHARS ||
         this.state.answerText.length === 0
      ) {
         return true;
      } else return false;
   }

   render() {
      return (
         <AppTemplate>
            <p className="text-center lead text-muted my-2">Add an answer</p>

            <div className="card">
               <div className="card-body bg-secondary lead">
                  {/* <!-- We put in two different text areas 
                            for the mockup depending on screen size, 
                            so that 300 characters would show without 
                            having scroll bars. d-md-none and d-md-block-->
                     <!-- Autofocus is an attribute so the cursor is
                        automatically blinking when the page loads. -->
                     <!-- Commenting the first textarea out, to focus on character counts */}

                  <textarea
                     rows="6"
                     id="create-answer-input"
                     autoFocus={true}
                     defaultValue=""
                     onChange={(e) => this.setAnswerText(e)} // whatever the user changes to the card, it fires to update the state
                  ></textarea>
               </div>
            </div>

            <p
               id="answer-characters"
               className="float-right mt-2 mb-5 text-muted"
            >
               <span
                  id="answer-char-count"
                  className={classnames({
                     "text-danger": checkIsOver(
                        this.state.answerText,
                        MAX_CARD_CHARS
                     ),
                  })}
               >
                  {this.state.answerText.length}/{MAX_CARD_CHARS}
               </span>
            </p>

            <div className="clearfix"></div>

            <div className="float-right">
               <Link
                  to="/create-imagery"
                  id="next"
                  className={classnames("btn btn-outline-primary", {
                     disabled: this.checkHasInvalidCharCount(),
                  })}
               >
                  Next
               </Link>
            </div>
         </AppTemplate>
      );
   }
}
