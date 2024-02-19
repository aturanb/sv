import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  }

  return (
    <>
      <form>
        <input
          className="my-2 rounded-2xl pl-2"
          type="email"
          name="email"
          id="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="my-2 rounded-2xl pl-2"
          type="password"
          name="password"
          id="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <button onClick={handleLogin}>Login</button>
    </>
  );
}

export default Login;
