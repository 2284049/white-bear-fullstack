import React from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";

class LogIn extends React.Component {
   // this function turned into a class will have a bunch of functions in it
   constructor(props) {
      super(props);
      this.state = {
         emailError: "",
         passwordError: "",
         hasEmailError: false,
         hasPasswordError: false,
      };
   }

   async validateAndLogInUser() {
      const emailInput = document.getElementById("login-email-input").value; // get the user email input
      const passwordInput = document.getElementById("login-password-input")
         .value;
      const user = {
         email: emailInput,
         password: passwordInput,
      };
      axios // WE WANT THE API CALL TO HAPPEN AFTER THEY'VE BEEN VALIDATED
         .post("/api/v1/users/auth", user)
         .then((res) => {
            // Set token in localstorage
            const authToken = res.data;
            localStorage.setItem("authToken", authToken);
            const user = jwtDecode(authToken);
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: user,
            });
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
      // TO TAKE THE VALIDATED USER TO NEXT PAGE
      // First, put up top: import { withRouter } from "react-router-dom";
      // take out the export defult at top and put on bottom of page like this: export default withRouter(LogIn);
      // use this code to tell it which page to go to:
   }

   render() {
      return (
         <>
            <div className="col-12 col-lg-5">
               <div className="card mt-8 mt-lg-0 ml-lg-8">
                  <div className="card-body text-dark">
                     <h2>Welcome back</h2>
                     <p className="font-sans-serif mt-3 mb-5">
                        Log in with your email address and password.
                     </p>
                     <div className="form-group">
                        <label
                           htmlFor="login-email-input"
                           className="text-muted lead font-sans-serif"
                        >
                           Email address
                        </label>
                        <input
                           type="email"
                           className={classnames({
                              "form-control": true,
                              "is-invalid": this.state.emailError, // is-invalid class will display when emailError state equals true
                           })}
                           id="login-email-input"
                        />
                        {this.state.hasEmailError && (
                           // when the hasEmailError state is true
                           // which means there is an error, display this:
                           <p className="text-danger" id="login-email-error">
                              {this.state.emailError}
                           </p>
                        )}
                     </div>
                     <div className="form-group">
                        <label
                           htmlFor="login-password-input"
                           className="text-muted lead font-sans-serif"
                        >
                           Password
                        </label>
                        <input
                           type="email"
                           className={classnames({
                              "form-control": true,
                              "is-invalid": this.state.passwordError, // is-invalid class will display when emailError state equals true
                           })}
                           id="login-password-input"
                        />
                        {this.state.hasPasswordError && (
                           <p className="text-danger" id="login-password-error">
                              {this.state.passwordError}
                           </p>
                        )}
                     </div>
                     <button
                        type="password"
                        className="float-right btn btn-success btn-lg font-sans-serif"
                        onClick={() => {
                           this.validateAndLogInUser();
                        }}
                     >
                        Log in
                     </button>
                  </div>
               </div>
            </div>
         </>
      );
   }
}

function mapStateToProps(state) {
   //global state
   return {};
}
export default withRouter(connect(mapStateToProps)(LogIn));
