import actions from "../actions";

export default function creatableCard(creatableCard = {}, action) {
   // type & payload
   switch (action.type) {
      case actions.UPDATE_CREATABLE_CARD:
         return action.payload; // take this payload & put it in the global state (Redux Store)
      default:
         return creatableCard;
   }
}
