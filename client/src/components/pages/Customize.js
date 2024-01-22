import React, { useEffect } from "react";
import { redirect, useNavigate, useLocation } from "react-router-dom";

const Customize = (props) => {
  const location = useLocation();
  // const { loading } = location.monkey;
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!props.userId && loading && loading.monkey) {
  //     navigate("/");
  //     // redirect("/");
  //   }
  // }, [loading]);
  return (
    <>
      {!props.userId ? (
        redirect("/")
      ) : (
        <div className="text-4xl text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 py-2">
          Customize
        </div>
      )}
    </>
  );
};

export default Customize;
