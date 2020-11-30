import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewEmpty extends React.Component {
   goToPrevCard() {
      this.props.dispatch({
         type: actions.DECREMENT_QUEUE_INDEX,
      });
      this.props.history.push("/review-answer");
   }

   getMoreCards() {
      this.props.dispatch({ type: actions.RESET_QUEUE }); // if you're at the end of the cards list:
      this.props.history.push("/review-imagery");
   }

   render() {
      return (
         <AppTemplate>
            <p className="text-center lead text-muted my-2">Out of cards</p>

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
            <button
               to="/review-imagery"
               className="btn btn-outline-primary float-right"
               onClick={() => {
                  this.getMoreCards();
               }}
            >
               Get more cards
            </button>
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
export default connect(mapStateToProps)(ReviewEmpty);
