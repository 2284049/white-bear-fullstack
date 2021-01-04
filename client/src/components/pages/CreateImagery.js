import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import saveIcon from "../../icons/save.svg";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

class CreateImagery extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         imageryText: "",
      };
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value }); // set the state of imageryText to be whatever the user inputs in that field (e.target.value)
   }

   checkHasInvalidCharCount() {
      if (
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else return false;
   }

   updateCreatableCard() {
      if (!this.checkHasInvalidCharCount()) {
         console.log("UPDATING CREATABLE CARD");
         const creatableCard = { ...this.props.creatableCard }; // Grabbing all the properties from Redux Store with spread operator
         creatableCard.imagery = this.state.imageryText; // updating the imagery property
         this.props.dispatch({
            // update the Redux Global State Store
            type: actions.UPDATE_CREATABLE_CARD,
            payload: creatableCard,
         });

         // ANOTHER WAY TO DO IT:
         // const {
         //    id,
         //    answer,
         //    userId,
         //    createdAt,
         //    nextAttemptAt,
         //    lastAttemptAt,
         //    totalSuccessfulAttempts,
         //    level,
         // } = this.props.creatableCard;
         // // we are getting all these properties from creatableCard in the Redux Global State Store
         // // and giving them all the suffix of this.props.creatableCard
         // // so now we have "answer" as a const we can use below which = this.props.creatableCard.answer
         // await this.props.dispatch({
         //    type: actions.UPDATE_CREATABLE_CARD,
         //    payload: {
         //       id: id, // or just id,
         //       answer: answer, // or just answer,
         //       imagery: this.state.imageryText, // if the key and the value are the same, you can type it once
         //       userId,
         //       createdAt,
         //       nextAttemptAt,
         //       lastAttemptAt,
         //       totalSuccessfulAttempts,
         //       level,
         //    },
         // });

         axios // save to database (make an api call)
            .post("/api/v1/memory-cards", creatableCard)
            // we defined creatableCard up above as a copy of this.state.creatableCard
            .then((res) => {
               console.log("Memory Card created");
               // display success overlay
               this.props.dispatch({
                  type: actions.UPDATE_CREATABLE_CARD,
                  payload: {}, // this empty object clears creatableCard from Redux Store
               });
               this.props.history.push("/create-answer"); // route to create-answer
            })
            .catch((err) => {
               const data = err.response.data;
               console.log(data);
               // display error overlay & hide error overlay after 5 sec
            });
      }
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
                  {this.props.creatableCard.answer}
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
            <button
               className={classnames(
                  "btn btn-primary btn-lg ml-4 float-right",
                  {
                     disabled: this.checkHasInvalidCharCount(),
                  }
               )}
               onClick={() => {
                  this.updateCreatableCard();
               }}
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
            </button>
         </AppTemplate>
      );
   }
}

// THIS IS WHAT WE NEED TO MAKE REDUX WORK ON THIS PAGE
function mapStateToProps(state) {
   //global state
   return { creatableCard: state.creatableCard };
   // we are creating a property called creatableCard and getting it from the Redux Store global state
   // we are mapping what we just grabbed from the Redux Global State Store and giving it to this local component
   // up in updateCreatableCard(), we will pass it in:
   //
}
export default connect(mapStateToProps)(CreateImagery);
