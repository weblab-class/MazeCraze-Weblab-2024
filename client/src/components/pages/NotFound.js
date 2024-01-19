import React from "react";
import ErrorPage from "../../public/images/error_page.svg";
const NotFound = () => {
  return (
    <>
      <div className="bg-primary-bg min-h-screen h-full w-full">
        <img className="h-screen w-full" src={ErrorPage} />
      </div>
    </>
  );
};

export default NotFound;
