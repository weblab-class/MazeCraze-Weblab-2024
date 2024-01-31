import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import SignupMaze from "../modules/SignupMaze";

const SignIn = ({ userId, handleLogin, handleLogout, isLoggedIn, setIsLoggedIn, setUserId }) => {
  return (
    //Google Login button is the whole screen
    <>
      {/* <div className="w-screen h-full min-h-screen bg-primary-bg text-primary-text" onClick={() => {handleLogin()}}>Sign In Page</div> */}
      <GoogleOAuthProvider
        clientId={"111532973746-seocmk0fff7s6feauriigvt11359c5td.apps.googleusercontent.com"}
      >
        {userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <SignupMaze
              GoogleLoginButton={
                <GoogleLogin onSuccess={handleLogin} onError={(err) => {
                  // console.log(err)
                }} />
              }
            />
          </>
        )}
      </GoogleOAuthProvider>
    </>
  );
};

export default SignIn;
