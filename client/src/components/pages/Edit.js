import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import saveIcon from "../../icons/save.svg";
import toDisplayDate from "date-fns/format"; // downloaded library date-fns
import classnames from "classnames";
import {
   checkIsOver,
   MAX_CARD_CHARS,
   safelyParseJson,
} from "../../utils/helpers";
import { connect } from "react-redux";
import actions from "../../store/actions";
import isEmpty from "lodash/isEmpty";
// mock data: import memoryCards from "../../mock-data/memory-cards";
import without from "lodash/without";
import axios from "axios";

// mock data const memoryCard = memoryCards[3];

class Edit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: this.props.editableCard.card.answer,
         imageryText: this.props.editableCard.card.imagery,
         isDisplayingDeleteButton: false,
      };
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value }); // set the state of imageryText to be whatever the user inputs in that field (e.target.value)
   }

   setAnswerText(e) {
      this.setState({ answerText: e.target.value }); // set the state of imageryText to be whatever the user inputs in that field (e.target.value)
   }

   updateState(e) {
      let value = e.target.value;
      if (value === "true" || value === "false") {
         value = safelyParseJson(value); // "true" will turn into true
      }
      this.setState({ [e.target.name]: value });
   }

   // toggleDeleteButton() {
   //    this.setState({isDeleteChecked: !this.state.isDeleteChecked})
   // }

   checkHasInvalidCharCount() {
      if (
         this.state.answerText.length > MAX_CARD_CHARS ||
         this.state.answerText.length === 0 ||
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else return false;
   }

   deleteCard() {
      // TODO: delete from database
      if (this.props.editableCard.prevRoute === "/review-answer") {
         this.deleteCardFromStore();
      }
      if (this.props.editableCard.prevRoute === "/all-cards") {
         this.props.history.push("/all-cards");
      }
   }

   saveCardEdit() {
      if (!this.checkHasInvalidCharCount()) {
         const memoryCard = { ...this.props.editableCard.card }; // make a shallow copy first
         memoryCard.answer = this.state.answerText;
         memoryCard.imagery = this.state.imageryText;
         axios // use .put to update something that ALREADY EXISTS
            .put(`/api/v1/memory-cards/${memoryCard.id}`, memoryCard) // for PUT, you have to use an id - ${memoryCard.id}
            .then((res) => {
               console.log("Memory Card updated");
               // update queue in redux with edited card:
               const cards = [...this.props.queue.cards]; // make a copy of the queue cards from Redux
               cards[this.props.queue.index] = memoryCard; // get the card we are on and set it as memoryCard
               this.props.dispatch({
                  type: actions.UPDATE_QUEUED_CARDS,
                  payload: cards,
               });
               // display success overlay
               this.props.history.push(this.props.editableCard.prevRoute);
            })
            .catch((err) => {
               const data = err.response.data;
               console.log(data);
               // display error overlay & hide error overlay after 5 sec
            });
      }
   }

   deleteCardFromStore() {
      const deletedCard = this.props.editableCard.card;
      const cards = this.props.queue.cards;
      const filteredCards = without(cards, deletedCard);
      console.log(filteredCards);
      this.props.dispatch({
         type: actions.UPDATE_QUEUED_CARDS,
         payload: filteredCards,
      });
      if (filteredCards[this.props.queue.index] === undefined) {
         this.props.history.push("/review-empty");
      } else {
         this.props.history.push("/review-imagery");
      }
   }

   render() {
      return (
         <AppTemplate>
            <p className="text-center lead text-muted my-2">Edit card</p>
            {isEmpty(this.props.editableCard) === false && (
               <>
                  <div className="card">
                     <div className="card-body bg-primary lead">
                        <textarea
                           rows="4"
                           id="edit-imagery-input"
                           defaultValue={this.props.editableCard.card.imagery}
                           onChange={(e) => this.setImageryText(e)} // whatever the user changes to the card, it fires to update the state
                        ></textarea>
                     </div>
                  </div>
                  <div className="card">
                     <div className="card-body bg-secondary lead">
                        <textarea
                           rows="4"
                           id="edit-answer-input"
                           defaultValue={this.props.editableCard.card.answer}
                           onChange={(e) => this.setAnswerText(e)}
                        ></textarea>
                     </div>
                  </div>

                  <p className="float-right mt-2 mb-5 text-muted">
                     <span
                        className={classnames({
                           "text-danger": checkIsOver(
                              this.state.imageryText,
                              MAX_CARD_CHARS
                           ),
                        })}
                     >
                        Top: {this.state.imageryText.length}/{MAX_CARD_CHARS}
                     </span>
                     &nbsp;&nbsp;
                     <span
                        className={classnames({
                           "text-danger": checkIsOver(
                              this.state.answerText,
                              MAX_CARD_CHARS
                           ),
                        })}
                     >
                        Bottom: {this.state.answerText.length}/{MAX_CARD_CHARS}
                     </span>
                  </p>
                  <div className="clearfix"></div>

                  <Link
                     to={this.props.editableCard.prevRoute}
                     className="btn btn-link mt-1"
                  >
                     Discard changes
                  </Link>
                  <button
                     className={classnames(
                        "btn btn-primary btn-lg ml-4 float-right",
                        { disabled: this.checkHasInvalidCharCount() }
                     )}
                     id="edit-save"
                     onClick={() => {
                        this.saveCardEdit();
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

                  <p className="text-center lead text-muted my-5">
                     Card properties
                  </p>

                  <div className="row">
                     <div className="col-4">
                        <p className="text-muted mt-1">Created on:</p>
                        <p className="text-muted mt-1">Last attempt:</p>
                        <p className="text-muted mt-1">Next attempt:</p>
                        <p className="text-muted mt-1">Consecutives:</p>
                     </div>
                     <div className="col-8">
                        <p className="mt-1">
                           {toDisplayDate(
                              this.props.editableCard.card.createdAt,
                              "MMM d, y"
                           )}
                        </p>
                        <p className="mt-1">
                           {toDisplayDate(
                              this.props.editableCard.card.lastAttemptAt,
                              "MMM d, y"
                           )}
                        </p>
                        <p className="mt-1">
                           {toDisplayDate(
                              this.props.editableCard.card.nextAttemptAt,
                              "MMM d, y"
                           )}
                        </p>
                        <p className="mt-1">
                           {
                              this.props.editableCard.card
                                 .totalSuccessfulAttempts
                           }
                        </p>
                     </div>
                  </div>

                  <div className="custom-control custom-checkbox mt-5 mb-3">
                     <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isDisplayingDeleteButton"
                        checked={this.state.isDisplayingDeleteButton} //check the isAdvancedView object
                        name="isDisplayingDeleteButton"
                        value={!this.state.isDisplayingDeleteButton}
                        onChange={(e) => {
                           this.updateState(e);
                        }}
                     />

                     <label
                        className="custom-control-label text-muted"
                        htmlFor="isDisplayingDeleteButton"
                     >
                        Show delete button
                     </label>
                  </div>
                  {this.state.isDisplayingDeleteButton && (
                     <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                           this.deleteCard();
                        }}
                     >
                        Delete this card
                     </button>
                  )}
               </>
            )}

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
         </AppTemplate>
      );
   }
}

function mapStateToProps(state) {
   //global state
   return {
      editableCard: state.editableCard,
      queue: state.queue,
   };
}
export default connect(mapStateToProps)(Edit);
