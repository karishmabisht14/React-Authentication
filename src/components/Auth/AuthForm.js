import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const enteredInputEmail = useRef("");
  const enteredInputPassword = useRef("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = enteredInputEmail.current.value;
    const enteredPassword = enteredInputPassword.current.value;

    setIsLoading(true);
    if (isLogin) {
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTc5hUWuJpKA5VgG9JxBTO90TXT7mmdNg',
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then(res => {
        setIsLoading(false);
        if(res.ok) {
          return res.json().then(data => {
            console.log("Token ID--------->", data.idToken);
          })
        }
        else {
          return res.json().then(data => {
            let errorMessage = 'Authentication Failed!!!'
            if(data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          })
        }
      })
    }
     
    else {
      fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBTc5hUWuJpKA5VgG9JxBTO90TXT7mmdNg',
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(res => {
        setIsLoading(false);
        if(res.ok) {

        }else {
          return res.json().then(data => {
            let errorMessage = 'Authentication Falied!!!'
            if(data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          })
        }
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={enteredInputEmail} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={enteredInputPassword}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
