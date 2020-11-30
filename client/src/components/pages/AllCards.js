import React from "react";
import AppTemplate from "../ui/AppTemplate";
import MemoryCard from "../ui/MemoryCard";
import orderBy from "lodash/orderBy";
import axios from "axios";

// THIS PAGE IS A GOOD EXAMPLE OF
// ***** LOCAL STATE *****
// We don't need "all cards" anywhere else.
// On other pages, we are using the list of queued cards, which has global state.

export default class AllCards extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         orderSelection: '[["createdAt"], ["desc"]]', // choosing from the dropdown "most recent"
         displayedMemoryCards: [], // setting the order of the cards to the most recent parameters
         allMemoryCards: [],
      };
   }

   componentDidMount() {
      axios
         .get("https://run.mocky.io/v3/cd3b2851-1a2d-46f4-a491-3ce34f57d4f7")
         .then((res) => {
            // handle success
            console.log(res);
            const memoryCards = res.data;
            this.setState({
               displayedMemoryCards: orderBy(
                  memoryCards,
                  ["createdAt"],
                  ["desc"]
               ), // setting the order of the cards to the most recent parameters
               allMemoryCards: orderBy(memoryCards, ["createdAt"], ["desc"]),
            });
         })
         .catch((error) => {
            // handle error
         });
   }

   filterByInput() {
      const input = document.getElementById("search-input").value;
      const lowerCasedInput = input.toLowerCase();
      console.log(lowerCasedInput);
      const copyOfAllMemoryCards = [...this.state.allMemoryCards];
      const filteredMemoryCards = copyOfAllMemoryCards.filter((memoryCard) => {
         const lowerCasedImagery = memoryCard.imagery.toLowerCase();
         const lowerCasedAnswer = memoryCard.answer.toLowerCase();

         if (
            lowerCasedImagery.includes(lowerCasedInput) ||
            lowerCasedAnswer.includes(lowerCasedInput)
         ) {
            return true;
         } else return false;
      });
      this.setState({ displayedMemoryCards: filteredMemoryCards }, () => {
         this.setMemoryCards();
      });
   }

   setOrderSelection(e) {
      const newOrder = e.target.value; // '["totalSuccessfulAttempts", "createdAt"], ["asc", "desc"]'
      this.setState(
         {
            orderSelection: newOrder,
         },
         () => {
            this.setMemoryCards();
         }
      );
   }

   setMemoryCards() {
      const copyOfDisplayedMemoryCards = [...this.state.displayedMemoryCards];
      const orderedMemoryCards = orderBy(
         copyOfDisplayedMemoryCards,
         ...JSON.parse(this.state.orderSelection) // removes string quotation marks on outside: ["totalSuccessfulAttempts", "createdAt"], ["asc", "desc"]
      );
      this.setState({
         displayedMemoryCards: orderedMemoryCards,
      }); // orderSelection now displays as "hardest"
      // memoryCards is being sorted by ["totalSuccessfulAttempts", "createdAt"], ["asc", "desc"]
   }

   render() {
      return (
         <AppTemplate>
            <div className="row my-4">
               <div className="col-8">
                  <input
                     className="form-control form-control-sm"
                     type="text"
                     placeholder="Search for a word"
                     id="search-input"
                  />
               </div>
               <div className="col-4">
                  <button
                     className="btn btn-primary btn-block btn-sm"
                     onClick={() => this.filterByInput()}
                  >
                     Search
                  </button>
               </div>
            </div>

            <div className="row my-4 no-gutters">
               <div className="col-4">
                  <p className="text-muted mt-1">Sort cards by</p>
               </div>
               <div className="col-8">
                  <select
                     value={this.state.orderSelection}
                     className="form-control form-control-sm"
                     onChange={(e) => this.setOrderSelection(e)}
                  >
                     <option value='[["createdAt"], ["desc"]]'>
                        Most recent
                     </option>
                     <option value='[["createdAt"], ["asc"]]'>Oldest</option>
                     <option value='[["totalSuccessfulAttempts", "createdAt"], ["asc", "desc"]]'>
                        Hardest
                     </option>
                     <option value='[["totalSuccessfulAttempts", "createdAt"], ["desc", "desc"]]'>
                        Easiest
                     </option>
                  </select>
               </div>
            </div>
            {this.state.displayedMemoryCards.map((memoryCard) => {
               return <MemoryCard card={memoryCard} key={memoryCard.id} />;
            })}
         </AppTemplate>
      );
   }
}
