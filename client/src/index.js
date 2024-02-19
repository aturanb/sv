import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import NavBar from "./components/Navbar";
import AI from "./AI";
import SignUpForm from "./SignUpForm";
import Login from "./pages/Auth/Login";

const router = createBrowserRouter([
  {
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/myprofile",
        element: <ProfilePage />,
      },
      {
        path: "/profiles/:profileId",
        element: <ProfilePage />,
      },
      {
        path: "/generateStory",
        element: <AI />,
      },
      {
        path: "/signup",
        element: <SignUpForm />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <NavBar />
    </RouterProvider>
  </React.StrictMode>
);
