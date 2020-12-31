import React from "react";
import AppTemplate from "../ui/AppTemplate";
// import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS, defaultLevel } from "../../utils/helpers";
import actions from "../../store/actions";
import { connect } from "react-redux";
import { v4 as getUuid } from "uuid";
import getNextAttemptAt from "../../utils/getNextAttemptAt";

class CreateAnswer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: this.props.creatableCard.answer || "",
         // use what is there OR if nothing is there (undefined), give it an empty string
      };
   }

   setAnswerText(e) {
      this.setState({ answerText: e.target.value }); // set the state of imageryText to be whatever the user inputs in that field (e.target.value)
      // console.log(e.target.value);
   }

   checkHasInvalidCharCount() {
      if (
         this.state.answerText.length > MAX_CARD_CHARS ||
         this.state.answerText.length === 0
      ) {
         return true;
      } else return false;
   }

   setCreatableCard() {
      if (!this.checkHasInvalidCharCount()) {
         // if it does NOT have an invalid char count, do this:
         console.log("UPDATE_CREATABLE_CARD");
         const currentTime = Date.now();
         this.props.dispatch({
            type: actions.UPDATE_CREATABLE_CARD,
            payload: {
               // the card itself
               id: getUuid(),
               answer: this.state.answerText,
               imagery: "",
               userId: this.props.currentUser.id,
               createdAt: currentTime,
               nextAttemptAt: getNextAttemptAt(defaultLevel, currentTime), //
               lastAttemptAt: currentTime,
               totalSuccessfulAttempts: 0,
               level: 1,
            },
         });
         this.props.history.push("/create-imagery");
      }
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
                     defaultValue={this.state.answerText}
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
               <button
                  className={classnames("btn btn-outline-primary", {
                     disabled: this.checkHasInvalidCharCount(),
                  })}
                  onClick={() => {
                     this.setCreatableCard();
                  }}
               >
                  Next
               </button>
            </div>
         </AppTemplate>
      );
   }
}

// THIS IS WHAT WE NEED TO MAKE REDUX WORK ON THIS PAGE
function mapStateToProps(state) {
   //global state
   return {
      currentUser: state.currentUser,
      creatableCard: state.creatableCard,
   };
   // we are creating a property called current user and getting it from the Redux Store global state
   // we are mapping what we just grabbed from the Redux Global State Store and giving it to this local component
   // up in setCreatableCard(), we will pass it in as:
   // userId: this.props.currentUser.id
}
export default connect(mapStateToProps)(CreateAnswer);
