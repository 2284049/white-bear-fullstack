import React from "react";
// import { Link } from "react-router-dom";
import classnames from "classnames";
import { v4 as getUuid } from "uuid";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class SignUp extends React.Component {
   // this function turned into a class will have a bunch of functions in it
   constructor(props) {
      super(props);
      this.state = {
         isDisplayingInputs: false,
         emailError: "",
         passwordError: "",
         hasEmailError: false,
         hasPasswordError: false,
      };
   }

   displayInputs() {
      this.setState({
         isDisplayingInputs: true,
      });
   }

   async validateAndCreateUser() {
      const emailInput = document.getElementById("signup-email-input").value; // get the user email input
      const passwordInput = document.getElementById("signup-password-input")
         .value;
      console.log({ emailInput, passwordInput });
      // create user obj
      const user = {
         id: getUuid(),
         email: emailInput,
         password: passwordInput,
         createdAt: Date.now(),
      };
      // post to API
      axios
         .post("/api/v1/users", user)
         .then((res) => {
            console.log(res.data);
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: res.data,
            });
            // TODO: add this in once we pass the authToken in our response
            // axios.defaults.headers.common["x-auth-token"] = authToken;
            this.props.history.push("/create-answer");
         })
         .catch((err) => {
            const data = err.response.data;
            console.log(data);
            const { emailError, passwordError } = data;
            if (emailError !== "") {
               this.setState({ hasEmailError: true, emailError: emailError });
            } else {
               this.setState({ hasEmailError: false, emailError: emailError });
            }
            if (passwordError !== "") {
               this.setState({
                  hasPasswordError: true,
                  passwordError: passwordError,
               });
            } else {
               this.setState({
                  hasPasswordError: false,
                  passwordError: passwordError,
               });
            }
         });
   }

   render() {
      // put the body of your function here
      return (
         <div className="col-12 col-lg-5">
            <div className="card">
               <div className="card-body text-dark">
                  <h2>Nice to meet you</h2>
                  <p className="font-sans-serif mt-3">
                     Sign up for White Bear. Free Forever.
                  </p>
                  {this.state.isDisplayingInputs && (
                     // we are saying we want the stuff below to display
                     // when this state is true
                     // it's initially set to false
                     <div id="create-account-card" className="">
                        <p className="text-blue font-sans-serif mt-2 mb-5">
                           Let's get you signed up.
                        </p>
                        <div className="form-group">
                           <label
                              htmlFor="signup-email-input"
                              className="text-muted lead font-sans-serif"
                           >
                              Email address
                           </label>
                           <input
                              type="email"
                              className={classnames({
                                 "form-control": true,
                                 "is-invalid": this.state.hasEmailError, // is-invalid class will display when emailError state equals true
                              })}
                              id="signup-email-input"
                           />
                           {this.state.hasEmailError && (
                              // when the hasEmailError state is true
                              // which means there is an error, display this:
                              <p className="text-danger" id="email-error">
                                 {this.state.emailError}
                              </p>
                           )}
                        </div>
                        <div className="form-group">
                           <label
                              htmlFor="signup-password-input"
                              className="text-muted lead font-sans-serif"
                           >
                              Create a password
                              <br />
                              <span className="text-muted">
                                 Must be at least 9 characters
                              </span>
                           </label>
                           <input
                              type="password"
                              className={classnames({
                                 "form-control": true,
                                 "is-invalid": this.state.hasPasswordError, // is-invalid class will display when emailError state equals true
                              })}
                              id="signup-password-input"
                           />
                           {this.state.hasPasswordError && (
                              <p className="text-danger" id="password-error">
                                 {this.state.passwordError}
                              </p>
                           )}
                        </div>

                        <button
                           to="/create-answer"
                           className="float-right btn btn-success btn-lg font-sans-serif"
                           style={{ width: "100%" }}
                           id="lets-go"
                           onClick={() => {
                              this.validateAndCreateUser();
                           }}
                        >
                           Let's go!
                        </button>
                     </div>
                  )}

                  {!this.state.isDisplayingInputs && (
                     // now we are telling it what to do when
                     // the state of this object is set to false
                     // by putting an exclamation point in front of it
                     // we want the sign up button to show when the state is false
                     <button
                        className="btn btn-success btn-lg font-sans-serif mt-5"
                        style={{ width: "100%" }}
                        id="sign-up-button"
                        onClick={() => {
                           this.displayInputs();
                           // when the button is clicked
                           // and the state of isDislayingSignUpInputs changes to false
                           // the sign up button disappears and the sign up card displays
                        }}
                     >
                        Sign up
                     </button>
                  )}
               </div>
            </div>
         </div>
      );
   }
}

function mapStateToProps(state) {
   //global state
   return {};
}
export default withRouter(connect(mapStateToProps)(SignUp));
