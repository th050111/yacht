import { authService } from "../myBase";
import React, { useState } from "react";
import "../css/Auth.css"

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { target: { name, value } } = event;
    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value);
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    let data;
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email, password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      };
      console.log(data);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  }
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <div className="login-ground">
      <div className="login-input">
        <form className="login-form" onSubmit={onSubmit}>
          <div className="input">
				<input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
            <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
          </div>
          <input className="login-button" type="submit" value={newAccount ? "Sign In" : "Log In"} />
        </form>
        <span className="create-toggle" onClick={toggleAccount}>{!newAccount ? "Sign in" : "Log In"}</span>
        {error}
      </div>
    </div>
  )
}