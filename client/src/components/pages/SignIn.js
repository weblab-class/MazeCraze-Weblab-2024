import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";


const SignIn = ({ userId, handleLogin, handleLogout, isLoggedIn, setIsLoggedIn }) => {
  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: tokenResponse => {console.log(tokenResponse); setIsLoggedIn(true)},
    onError: (err) => console.log(`There is a Google Login error: ${err}`)
  });
  return (
    <>
      <div className="w-screen h-full min-h-screen bg-primary-bg" onClick={() => {login()}}></div>
    </>
  );
};

export default SignIn;
