import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewImagery extends React.Component {
   constructor(props) {
      super(props);
      if (props.queue.cards.length === 0) {
         // if this is an empty array, then:
         axios
            .get(
               `http://localhost:3045/api/v1/memory-cards?&order=memory_cards.created_at%20DESC`
            )
            .then((res) => {
               // handle success
               const cards = res.data;
               console.log(res);
               props.dispatch({
                  type: actions.UPDATE_QUEUED_CARDS,
                  payload: cards,
               });
            })
            .catch((error) => {
               // handle error
            });
      }
      if (props.queue.index > props.queue.cards.length) {
         this.props.history.push("/review-empty");
      }
   }

   goToPrevCard() {
      this.props.dispatch({
         type: actions.DECREMENT_QUEUE_INDEX,
      });
      this.props.history.push("/review-answer");
   }

   render() {
      const memoryCard = this.props.queue.cards[this.props.queue.index];
      return (
         <AppTemplate>
            <div className="card mb-5">
               <div className="card-body bg-primary lead">
                  {memoryCard && memoryCard.imagery}
               </div>
            </div>
            {this.props.queue.index > 0 && (
               <button
                  className="btn btn-link mt-1"
                  onClick={() => {
                     this.goToPrevCard();
                  }}
               >
                  Previous card
               </button>
            )}

            <Link
               to="/review-answer"
               className="btn btn-outline-primary float-right"
            >
               Show answer
            </Link>
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
export default connect(mapStateToProps)(ReviewImagery);
