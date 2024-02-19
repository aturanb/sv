import React from "react";
import { Link, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// Menu component
const NavBar = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <nav>
        <div>
          <Link to="/">Home</Link>
          {user && <Link to={`/profiles/${user.displayName}`}>My Profile</Link>}
          {user && <Link to="/generateStory">Story Generator</Link>}
          {!user && <Link to="/signup">Sign Up</Link>}
          {!user && <Link to="/login">Login</Link>}
          {user && (
            <button
              onClick={() => {
                signOut(auth);
              }}
            >
              LogOut
            </button>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
