import actions from "../actions";

export default function currentUser(currentUser = {}, action) {
   // let newCurrentUser = { ...currentUser };

   switch (action.type) {
      case actions.UPDATE_CURRENT_USER:
         return action.payload;
      default:
         return currentUser;
   }
}
