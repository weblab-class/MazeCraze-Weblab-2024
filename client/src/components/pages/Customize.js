import React, { useEffect } from "react";
import { redirect, useNavigate, useLocation } from "react-router-dom";
import CustomizeBackground from "../../public/images/SettingsBackground.svg";


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
   
    <div class="bg-primary-pink h-screen w-full relative flex flex-col justify-center items-center text-primary-text font-custom tracking-widest">
        Customize
    
    <div class='h-[35%] w-[20%] absolute top-0 right-0 bg-primary-bg'></div>
  
    <div class='h-[35%] w-[20%] absolute left-0 bottom-0 bg-primary-bg'></div>
    <div class="h-[15%] flex justify-center items-center text-6xl absolute top-0 w-full text-primary-bg">
      Customize
    </div>

    <div class='h-[70%] w-[85%] absolute bg-primary-block text-4xl px-3 py-2'>
      KeyBinds
    </div>

  
  </div>
  );
};

export default Customize;
