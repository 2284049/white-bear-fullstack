import React from "react";
import "./style/master.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AllCards from "./components/pages/AllCards";
import Landing from "./components/pages/Landing";
import CreateAnswer from "./components/pages/CreateAnswer";
import CreateImagery from "./components/pages/CreateImagery";
import ReviewImagery from "./components/pages/ReviewImagery";
import ReviewAnswer from "./components/pages/ReviewAnswer";
import ReviewEmpty from "./components/pages/ReviewEmpty";
import Edit from "./components/pages/Edit";
import NotFound from "./components/pages/NotFound";
import jwtDecode from "jwt-decode";
import store from "./store/store";
import actions from "./store/actions";

const authToken = localStorage.authToken;
if (authToken) {
   // if the authToken is not expired
   const currentTimeInSeconds = Date.now() / 1000;
   const user = jwtDecode(authToken);
   if (currentTimeInSeconds > user.exp) {
      console.log("expired token");
      store.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: {},
      });
      // remove the currentUser from the global store
   } else {
      console.log("valid token");
      // store user in global state / redux store (currentUser)
      store.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: user,
      });
      const currentURL = window.location.pathname;
      if (currentURL === "/") {
         window.location.href = "/create-answer";
         // redirect to create-answer
      }
   }
   // set authorization headers
} else {
   console.log("no token");
}

function App() {
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/create-answer" component={CreateAnswer} />
            <Route exact path="/create-imagery" component={CreateImagery} />
            <Route exact path="/review-imagery" component={ReviewImagery} />
            <Route exact path="/review-answer" component={ReviewAnswer} />
            <Route exact path="/review-empty" component={ReviewEmpty} />
            <Route exact path="/all-cards" component={AllCards} />
            <Route exact path="/edit" component={Edit} />
            <Route component={NotFound} />
         </Switch>
      </Router>
   );
}

export default App;
