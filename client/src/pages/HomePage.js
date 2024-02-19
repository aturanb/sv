import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function HomePage() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return (
      <>
        <h1>HOME</h1>
        Welcome {user.displayName}
      </>
    );
  } else {
    return <p className="">Welcome</p>;
  }
}

export default HomePage;
