import React from "react";
import { Link } from "react-router-dom";
function NotFoundPage() {
  return (
    <>
      <div>404</div>
      <Link to="/">Home</Link>
    </>
  );
}

export default NotFoundPage;
