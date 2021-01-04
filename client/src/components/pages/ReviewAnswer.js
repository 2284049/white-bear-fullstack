import React from "react";
import thumbsUpIcon from "../../icons/thumbs-up.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

class ReviewAnswer extends React.Component {
   constructor(props) {
      super(props);
      if (this.props.queue.cards.length === 0) {
         this.props.history.push("/review-empty");
      }
   }

   updateCardWithNeedsWork(memoryCard) {
      this.goToNextCard();
   }

   updateCardWithGotIt(memoryCard) {
      // We need to make a copy of the memoryCard first before changing it:
      const newMemoryCard = { ...memoryCard };
      // get card we are on
      // Biz logic:
      /*
      increase SuccessfulAttempts by 1
      update lastAttemptedOn with today's date
      */
      newMemoryCard.totalSuccessfulAttempts += 1;
      newMemoryCard.lastAttemptAt = Date.now();
      // db PUT this card in our axios request
      // use PUT to update something that already exists (must exist already!)
      axios // save to database (make an api call)
         .put(`/api/v1/memory-cards/${newMemoryCard.id}`, newMemoryCard)
         // for PUT, you have to use an id - ${memoryCard.id}
         .then((res) => {
            console.log("Memory Card updated");
            // display success overlay
            this.goToNextCard();
         })
         .catch((err) => {
            const data = err.response.data;
            console.log(data);
            // display error overlay & hide error overlay after 5 sec
         });
   }

   // PUT to update
   // UPSERT to update or if it doesn't exist, insert

   goToNextCard() {
      if (this.props.queue.index === this.props.queue.cards.length - 1) {
         // you're on the last card
         this.props.dispatch({ type: actions.INCREMENT_QUEUE_INDEX }); // without this, it won't go back to the last card, it will go from card 4 to card 3
         this.props.history.push("/review-empty");
      } else {
         this.props.dispatch({ type: actions.INCREMENT_QUEUE_INDEX });
         this.props.history.push("/review-imagery");
      }
   }

   storeEditableCard(memoryCard) {
      console.log("STORING_EDITABLE_CARD");
      this.props.dispatch({
         type: actions.STORE_EDITABLE_CARD,
         payload: {
            card: memoryCard,
            prevRoute: "/review-answer",
         },
      });
   }

   render() {
      const memoryCard = this.props.queue.cards[this.props.queue.index];
      console.log("memory card: ", memoryCard);
      return (
         <AppTemplate>
            <div className="card">
               <div className="card-body bg-primary lead">
                  {memoryCard && memoryCard.imagery}
               </div>
            </div>
            <div className="card mb-5">
               <div className="card-body bg-secondary lead">
                  {memoryCard && memoryCard.answer}
               </div>
            </div>

            <Link
               to="/edit"
               className="btn btn-link mt-2"
               onClick={() => {
                  this.storeEditableCard(memoryCard);
               }}
            >
               Edit
            </Link>
            <div className="float-right">
               <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                     this.updateCardWithNeedsWork(memoryCard);
                  }}
               >
                  Needs work
               </button>
               <button
                  className="btn btn-primary ml-4"
                  onClick={() => {
                     this.updateCardWithGotIt(memoryCard);
                  }}
               >
                  <img
                     src={thumbsUpIcon}
                     width="20px"
                     style={{ marginBottom: "5px", marginRight: "3px" }}
                     alt=""
                  />
                  Got it
               </button>
            </div>
         </AppTemplate>
      );
   }
}

function mapStateToProps(state) {
   //global state
   return {
      queue: state.queue,
   };
}
export default connect(mapStateToProps)(ReviewAnswer);
