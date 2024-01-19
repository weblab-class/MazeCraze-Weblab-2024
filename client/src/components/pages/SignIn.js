import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "111532973746-seocmk0fff7s6feauriigvt11359c5td.apps.googleusercontent.com";

const SignIn = ({ userId, handleLogin, handleLogout }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      
      <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      
    </GoogleOAuthProvider>
  );
};

export default SignIn;
